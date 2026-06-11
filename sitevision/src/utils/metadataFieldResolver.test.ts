import type { Node } from "@sitevision/api/types/javax/jcr/Node";
import {
  resolveMetadataBackedBoolean,
  resolveMetadataBackedNode,
  resolveMetadataBackedString,
} from "./metadataFieldResolver";

const createDeps = (overrides?: {
  values?: Record<string, unknown>;
  nodes?: Record<string, unknown>;
  page?: unknown;
  properties?: Record<string, unknown>;
}) => {
  const values = overrides?.values || {};
  const nodes = overrides?.nodes || {};
  const page = overrides?.page || ({ id: "page" } as unknown as Node);
  const properties = overrides?.properties || {};

  return {
    appData: {
      get: (name: string) => values[name],
      getNode: (name: string) => nodes[name] as Node,
    },
    properties: {
      get: (_node: Node, propertyName: string) => properties[propertyName],
    },
    propertyUtil: {
      getNode: (_node: Node, propertyName: string) =>
        properties[propertyName] as Node,
    },
    portletContextUtil: {
      getCurrentPage: () => page as Node,
    },
  };
};

describe("resolveMetadataBackedString", () => {
  test("returns the manual appData value when metadata mode is disabled", () => {
    const value = resolveMetadataBackedString(
      "assistant_name",
      createDeps({
        values: {
          assistant_name: "Manual value",
          assistant_name__useMetadata: false,
        },
      })
    );

    expect(value).toBe("Manual value");
  });

  test("returns the current page metadata value when metadata mode is enabled", () => {
    const value = resolveMetadataBackedString(
      "assistant_name",
      createDeps({
        values: {
          assistant_name__useMetadata: true,
        },
        nodes: {
          assistant_name__metadata: {
            getName: () => "pageTitle",
          },
        },
        properties: {
          pageTitle: "Metadata value",
        },
      })
    );

    expect(value).toBe("Metadata value");
  });

  test("returns undefined when the metadata definition is missing", () => {
    const value = resolveMetadataBackedString(
      "assistant_name",
      createDeps({
        values: {
          assistant_name__useMetadata: true,
        },
      })
    );

    expect(value).toBeUndefined();
  });

  test("returns undefined when the metadata value is empty", () => {
    const value = resolveMetadataBackedString(
      "assistant_name",
      createDeps({
        values: {
          assistant_name__useMetadata: true,
        },
        nodes: {
          assistant_name__metadata: {
            getName: () => "pageTitle",
          },
        },
        properties: {
          pageTitle: "   ",
        },
      })
    );

    expect(value).toBeUndefined();
  });

  test("returns undefined when metadata value is not an allowed enum value", () => {
    const value = resolveMetadataBackedString(
      "assistant_avatar_color",
      createDeps({
        values: {
          assistant_avatar_color__useMetadata: true,
        },
        nodes: {
          assistant_avatar_color__metadata: {
            getName: () => "themeColor",
          },
        },
        properties: {
          themeColor: "invalid-color",
        },
      }),
      {
        allowedValues: ["vattjom", "juniskar"],
      }
    );

    expect(value).toBeUndefined();
  });

  test("keeps backward compatibility when companion keys are missing", () => {
    const value = resolveMetadataBackedString(
      "assistant_name",
      createDeps({
        values: {
          assistant_name: "Existing config",
        },
      })
    );

    expect(value).toBe("Existing config");
  });
});

describe("resolveMetadataBackedBoolean", () => {
  test("returns manual boolean values when metadata mode is disabled", () => {
    const value = resolveMetadataBackedBoolean(
      "show_history",
      createDeps({
        values: {
          show_history: true,
        },
      })
    );

    expect(value).toBe(true);
  });

  test("parses boolean metadata values", () => {
    const value = resolveMetadataBackedBoolean(
      "show_history",
      createDeps({
        values: {
          show_history__useMetadata: true,
        },
        nodes: {
          show_history__metadata: {
            getName: () => "showHistory",
          },
        },
        properties: {
          showHistory: "true",
        },
      })
    );

    expect(value).toBe(true);
  });

  test("returns undefined for invalid boolean metadata values", () => {
    const value = resolveMetadataBackedBoolean(
      "show_history",
      createDeps({
        values: {
          show_history__useMetadata: true,
        },
        nodes: {
          show_history__metadata: {
            getName: () => "showHistory",
          },
        },
        properties: {
          showHistory: "maybe",
        },
      })
    );

    expect(value).toBeUndefined();
  });
});

describe("resolveMetadataBackedNode", () => {
  test("returns the manual appData node when metadata mode is disabled", () => {
    const manualNode = { id: "manual" } as unknown as Node;

    const value = resolveMetadataBackedNode(
      "assistant_avatar",
      createDeps({
        nodes: {
          assistant_avatar: manualNode,
        },
      })
    );

    expect(value).toBe(manualNode);
  });

  test("returns the node from page metadata when metadata mode is enabled", () => {
    const metadataNode = { id: "metadata" } as unknown as Node;

    const value = resolveMetadataBackedNode(
      "assistant_avatar",
      createDeps({
        values: {
          assistant_avatar__useMetadata: true,
        },
        nodes: {
          assistant_avatar__metadata: {
            getName: () => "avatarField",
          } as unknown as Node,
        },
        properties: {
          avatarField: metadataNode,
        },
      })
    );

    expect(value).toBe(metadataNode);
  });

  test("returns undefined when metadata node value is a string reference", () => {
    const value = resolveMetadataBackedNode(
      "assistant_avatar",
      createDeps({
        values: {
          assistant_avatar__useMetadata: true,
        },
        nodes: {
          assistant_avatar__metadata: {
            getName: () => "avatarField",
          } as unknown as Node,
        },
        properties: {
          avatarField: "node-reference-string",
        },
      })
    );

    expect(value).toBeUndefined();
  });
});

import type { Node } from "@sitevision/api/types/javax/jcr/Node";

export interface AppDataResolverSource {
  get(name: string): unknown;
  getNode(name: string): Node;
}

export interface PropertiesResolverSource {
  get(node: Node, propertyName: string): unknown;
}

export interface PropertyUtilResolverSource {
  getNode(node: Node, propertyName: string, defaultValue: Node): Node;
}

export interface PortletContextResolverSource {
  getCurrentPage(): Node;
}

export interface MetadataFieldResolverDeps {
  appData: AppDataResolverSource;
  properties: PropertiesResolverSource;
  propertyUtil: PropertyUtilResolverSource;
  portletContextUtil: PortletContextResolverSource;
}

export interface MetadataFieldResolverOptions {
  allowedValues?: readonly string[];
}

const normalizeMetadataArray = (value: unknown): unknown[] | undefined => {
  if (!Array.isArray(value)) {
    return undefined;
  }

  return value.filter((item) => item !== undefined && item !== null);
};

const toManualString = (value: unknown): string | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return undefined;
};

const toMetadataString = (value: unknown): string | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  const arrayValue = normalizeMetadataArray(value);

  if (arrayValue) {
    const joinedValue = arrayValue
      .map((item) => toMetadataString(item))
      .filter((item): item is string => Boolean(item))
      .join(", ");

    return joinedValue || undefined;
  }

  if (typeof value === "string") {
    const normalizedValue = value.trim();
    return normalizedValue || undefined;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return undefined;
};

const toBoolean = (value: unknown): boolean | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    if (value === 1) {
      return true;
    }

    if (value === 0) {
      return false;
    }

    return undefined;
  }

  if (typeof value === "string") {
    const normalizedValue = value.trim().toLowerCase();

    if (["true", "1", "yes", "ja", "on"].includes(normalizedValue)) {
      return true;
    }

    if (["false", "0", "no", "nej", "off"].includes(normalizedValue)) {
      return false;
    }
  }

  return undefined;
};

const toNode = (value: unknown): Node | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  const arrayValue = normalizeMetadataArray(value);

  if (arrayValue) {
    return arrayValue[0] as Node | undefined;
  }

  if (typeof value === "object") {
    return value as Node;
  }

  return undefined;
};

const getMetadataValue = (
  fieldName: string,
  deps: MetadataFieldResolverDeps
): unknown => {
  const metadataFieldName = `${fieldName}__metadata`;
  const currentPage = deps.portletContextUtil.getCurrentPage();
  const metadataDefinition = deps.appData.getNode(metadataFieldName);
  const metadataPropertyName = getMetadataFieldPropertyName(metadataDefinition);

  if (!currentPage || !metadataPropertyName) {
    return undefined;
  }

  return deps.properties.get(currentPage, metadataPropertyName);
};

const getMetadataNodeValue = (
  fieldName: string,
  deps: MetadataFieldResolverDeps
): Node | undefined => {
  const metadataFieldName = `${fieldName}__metadata`;
  const currentPage = deps.portletContextUtil.getCurrentPage();
  const metadataDefinition = deps.appData.getNode(metadataFieldName);
  const metadataPropertyName = getMetadataFieldPropertyName(metadataDefinition);

  if (!currentPage || !metadataPropertyName) {
    return undefined;
  }

  return deps.propertyUtil.getNode(
    currentPage,
    metadataPropertyName,
    undefined as unknown as Node
  );
};

export const getMetadataFieldPropertyName = (
  metadataDefinition: unknown
): string | undefined => {
  if (
    metadataDefinition &&
    typeof metadataDefinition === "object" &&
    "getName" in metadataDefinition &&
    typeof metadataDefinition.getName === "function"
  ) {
    return toMetadataString(metadataDefinition.getName());
  }

  return undefined;
};

export const isMetadataModeEnabled = (
  fieldName: string,
  deps: MetadataFieldResolverDeps
): boolean => Boolean(deps.appData.get(`${fieldName}__useMetadata`));

export const resolveMetadataBackedString = (
  fieldName: string,
  deps: MetadataFieldResolverDeps,
  options: MetadataFieldResolverOptions = {}
): string | undefined => {
  if (!isMetadataModeEnabled(fieldName, deps)) {
    return toManualString(deps.appData.get(fieldName));
  }

  const metadataValue = toMetadataString(getMetadataValue(fieldName, deps));

  if (!metadataValue) {
    return undefined;
  }

  if (
    options.allowedValues &&
    !options.allowedValues.includes(metadataValue)
  ) {
    return undefined;
  }

  return metadataValue;
};

export const resolveMetadataBackedBoolean = (
  fieldName: string,
  deps: MetadataFieldResolverDeps
): boolean | undefined => {
  if (!isMetadataModeEnabled(fieldName, deps)) {
    return toBoolean(deps.appData.get(fieldName));
  }

  return toBoolean(getMetadataValue(fieldName, deps));
};

export const resolveMetadataBackedNode = (
  fieldName: string,
  deps: MetadataFieldResolverDeps
): Node | undefined => {
  if (!isMetadataModeEnabled(fieldName, deps)) {
    return deps.appData.getNode(fieldName);
  }

  return toNode(getMetadataNodeValue(fieldName, deps));
};

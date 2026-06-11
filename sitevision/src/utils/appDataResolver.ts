import type { Node } from "@sitevision/api/types/javax/jcr/Node";
import appData from "@sitevision/api/server/appData";
import portletContextUtil from "@sitevision/api/server/PortletContextUtil";
import propertyUtil from "@sitevision/api/server/PropertyUtil";
import properties from "@sitevision/api/server/Properties";
import {
  resolveMetadataBackedBoolean,
  resolveMetadataBackedNode,
  resolveMetadataBackedString,
} from "./metadataFieldResolver";

const resolverDeps = {
  appData,
  properties,
  propertyUtil,
  portletContextUtil,
};

export const getResolvedAppDataValue = (
  fieldName: string,
  options?: {
    allowedValues?: readonly string[];
  }
) => resolveMetadataBackedString(fieldName, resolverDeps, options);

export const getResolvedAppDataBoolean = (fieldName: string) =>
  resolveMetadataBackedBoolean(fieldName, resolverDeps);

export const getResolvedAppDataNode = (
  fieldName: string
): Node | undefined =>
  resolveMetadataBackedNode(fieldName, resolverDeps);

export default interface Asset {
  archive?: string;
  archiveDate?: Date;
  archiveReason?: string;
  assetClassId?: number;
  assetDataId?: number;
  assetStatusId?: number;
  assetTypeId: number;
  created?: Date;
  hdTicketsAsset?: any[];
  hdTicketsMachine?: any[];
  id: number;
  locationId?: number;
  mappedId?: number;
  modified?: Date;
  name: string;
  ownerId?: number;
}

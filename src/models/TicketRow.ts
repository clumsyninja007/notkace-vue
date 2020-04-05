export default interface TicketRow {
  Ticket: number;
  Title: string;
  Priority: string;
  Owner: string;
  Submitter: string;
  Asset?: string;
  Device?: string;
  Status: string;
  ReferredTo?: string;
  UserName: string;
  OriOrd: number;
  StatOrd: number;
  Dept: string;
  Location: string;
  open?: boolean;
}

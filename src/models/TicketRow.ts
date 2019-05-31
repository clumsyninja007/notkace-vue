import { Vue } from 'vue-property-decorator';

export class TicketRow extends Vue {
  public Ticket!: number;
  public Title!: string;
  public Priority!: string;
  public Owner!: string;
  public Submitter!: string;
  public Asset?: string;
  public Device?: string;
  public Status!: string;
  public ReferredTo?: string;
  public UserName!: string;
  public OriOrd!: number;
  public StatOrd!: number;
  public Dept!: string;
  public Location!: string;
  public open?: boolean;
}

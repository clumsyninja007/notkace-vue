import { Vue } from 'vue-property-decorator';

export default class Columns extends Vue {
  public title!: string;
  public dataIndex!: string;
  public sorter?: boolean;
  public width?: string;
  public customRender?: string;
}

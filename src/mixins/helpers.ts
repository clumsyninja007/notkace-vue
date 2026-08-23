import { defineComponent } from 'vue';

export default defineComponent({
  methods: {
    errorMessage(message: any) {
      this.$buefy.snackbar.open({
        message: message,
        type: 'is-danger',
        position: 'is-bottom',
        actionText: 'Close',
        indefinite: true,
        queue: false,
      });
    },

    fixDateTime(date: Date) {
      const commentDate = new Date(date);

      let hour;
      let amPm;

      if (commentDate.getHours() > 12) {
        hour = commentDate.getHours() - 12;
        amPm = 'PM';
      } else if (commentDate.getHours() === 12) {
        hour = 12;
        amPm = 'PM';
      } else if (commentDate.getHours() === 0) {
        hour = 12;
        amPm = 'AM';
      } else {
        hour = commentDate.getHours();
        amPm = 'AM';
      }

      return (
        this.fixDate(date) +
        ' ' +
        String(hour) +
        ':' +
        ('0' + commentDate.getMinutes()).slice(-2) +
        ' ' +
        amPm
      );
    },

    fixDate(date: Date) {
      const commentDate = new Date(date);

      return (
        commentDate.getMonth() +
        1 +
        '/' +
        commentDate.getDate() +
        '/' +
        commentDate.getFullYear()
      );
    },
  },
});

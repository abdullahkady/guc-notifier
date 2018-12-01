import sgMail from '@sendgrid/mail';
import { SENDGRID_API_KEY, applicationEmailAddress } from '../config';

sgMail.setApiKey(SENDGRID_API_KEY);

const emailUnsubscriptionNotification = (email) => {
  const bodyContent = "<h2>You will not recieve anymore messages from us!</h2> <br /> <p>If you didn't unsubscribe purposefully, then your GUC password has expired/changed, please resubscribe again to re-use the service.</p>";
  const message = {
    to: email,
    from: applicationEmailAddress,
    subject: 'You have been unsubscribed from The GUC Notifier',
    html: bodyContent,
  };
  return sgMail.send(message);
};

const generateGradesMarkup = (grades) => {
  let content = '<h1>New grades are out !</h1> <br />';
  grades.forEach((course) => {
    content += `<h3>${course.code}</h3><hr />`;
    content += '<ul>';
    course.coursework.forEach(({ type, grade, maximumGrade }) => {
      content += '<li>';
      content += `${type}: ${grade}/${maximumGrade} - ${((grade / maximumGrade) * 100).toFixed(
        2,
      )}%`;
      content += '</li>';
    });
    content += '</ul>';
  });
  return content;
};

const emailNewGrades = (email, newGrades) => {
  const message = {
    to: email,
    from: applicationEmailAddress,
    subject: 'New grades are out!',
    html: generateGradesMarkup(newGrades),
  };
  return sgMail.send(message);
};

export { emailUnsubscriptionNotification, emailNewGrades };

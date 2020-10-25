const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID);

const sendWelcomeMail= (email,name) => {
    sgMail.send({

        to: email,
        from:'sumitmaurya2777@gmail.com',
        subject: 'Thankyou for joining senmail',
        text: 'Welcome to the app , ${name}.  name. Let me know your experience with sendmail',

    })
}

const sendCancelMail= (email,name) => {
    sgMail.send({

        to: email,
        from:'sumitmaurya2777@gmail.com',
        subject: 'Sorry to loose you',
        text: 'Good bye',
        
    })
}

module.exports= {

    sendWelcomeMail, sendCancelMail
}
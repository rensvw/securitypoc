module.exports = function email(options) {

    const nodemailer = require("nodemailer");
    const Promise = require("bluebird");
    const EmailTemplate = require("email-templates").EmailTemplate
    const path = require("path");

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "rensvanw@gmail.com",
            pass: "SojCsv4XOBXp"
        }
    });
    
    const act = Promise.promisify(this.act, {
        context: this
    });

    function generateTemplate(msg, respond) {
        let template = msg.template;
        let templateDir = path.join(__dirname, "templates", template);
        let newTemplate = new EmailTemplate(templateDir)

        newTemplate.render({
            fullName: msg.fullName,
            code: msg.code
        }, function (err, result) {
            if (err) {
                return respond(console.log(err));
            }
            return respond(result);
        });
    }


    function sendMailWithCode(msg, respond) {
        act("role:generate,cmd:code")
            .then((generatedCode) => {
                this.generatedCode = generatedCode;
                return act("entity:user-mfa,get:uuid", {uuid: msg.uuid})
            })
            .then((user) => {
                this.user = user
                if(this.user.succes){
                    console.log(this.user)
                    respond({
                        uuid: this.user.uuid,
                        message: "The code has been sent to your email and a new email session has been started!",
                        redirectTo: "verifyEmailPage",
                        succes: true
                    });
                }
                else if(!user.succes){
                    return respond(user);
                }
                return act("entity:user-email,crud:user", {email: this.user.email,code: this.generatedCode.code, uuid: this.user.uuid,email:this.user.email})
            })
            .then((savedUser) => {
                return act("role:email,cmd:generate-template", {template: "verification",fullName: this.user.fullName,code: this.generatedCode.code})
            })
            .then((template) => {
                return act("role:email,cmd:send", { html: template.html,text: template.text,email: msg.email,subject: "Verification Code",email:this.user.email});
            })          
            .catch((err) => {
                return respond(err, null);
            })

    }

    function sendMail(msg, respond) {
        let mailOptions = {
            from: msg.from || "SecurityPOC", // sender address
            to: msg.email, // list of receivers
            subject: msg.subject || "This is a default subject!", // Subject line
            text: msg.text || "This is a default plain text message!", // plain text body
            html: msg.html || "<b><i>This is a default html message!</i></b>" // html body 
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log("Message %s sent: %s", info.messageId, info.response);
            respond({
                succes: true,
                message: "Message has been sent!"
            });
        });
    }

    this.add({role: "email",cmd: "send"}, sendMail);
    this.add({role: "email",cmd: "mfa" }, sendMailWithCode);
    this.add({role: "email",cmd: "generate-template"}, generateTemplate);
};
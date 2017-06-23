module.exports = function sms(options){

    const config = require("./config");
    const client = require("twilio")(config.accountSid, config.authToken);
    const randomID = require("random-id");
    const Promise = require("bluebird");

    var act = Promise.promisify(this.act, {context: this});
    
    function sendTextMessage(msg, respond) {
        let message = msg.message;
        let to = msg.to;
        let from = config.sendingNumber;
        client.messages.create({
            body: message,
            to: to,
            from: from
        }, function (err, data) {
            if (err) {
                respond(err, null);
            } else {
                respond({
                    message: "SMS has been send!"
                });
            }
        });
    }



/// nog niet getest
    function sendTextMessageWithCodeAndSave(msg, respond) {
        act("role:generate,cmd:code")
            .then((generatedCode) => {
                this.generatedCode = generatedCode
                return act("entity:user-sms,crud:user", {
                        email: msg.email,
                        code: generatedCode.code,
                        uuid: msg.uuid,
                        phoneNumber: msg.phoneNumber,
                        countryCode: msg.countryCode
                    })
                    .then((userSMSSession) => {
                        this.userSMSSession = userSMSSession;
                        if (userSMSSession.succes) {
                            return act("role:sms,cmd:send", {
                                    message: "Hello, your verification code is: " + this.generatedCode.code,
                                    to: userSMSSession.countryCode + userSMSSession.phoneNumber
                                })
                                .then((smsSent) => {
                                    return respond({
                                        uuid: this.userSMSSession.uuid,
                                        message: smsSent.message,
                                        redirectTo: "verifySMSPage",
                                        succes: true
                                    });
                                })
                                .catch((err) => {
                                    return respond(err)
                                })
                        } else {
                            return respond({
                                succes: false,
                                message: "User could not be found!"
                            })
                        }
                    })
            })
            .catch((err) => {
                respond(err)
            })
    }


    function createSMSCodeAndSave(msg, respond) {
        act("role:generate,cmd:code")
            .then((generatedCode) => {
                return act("entity:user-sms,crud:user", {
                        email: msg.email,
                        code: generatedCode.code,
                        uuid: msg.uuid,
                        phoneNumber: msg.phoneNumber,
                        countryCode: msg.countryCode
                    })
                    .then((savedCode) => {
                        if (savedCode.succes) {
                            respond(null,{
                                succes: true,
                                message: savedCode.message,
                                uuid: savedCode.uuid,
                                redirectTo: "verifySMSPage"
                            });
                        } else {
                            respond({
                                succes: false,
                                message: savedCode.message,
                            });
                        }
                    })
            })

            .catch((err) => {
                respond(err);
            });
    }

    this.add({role:"sms",cmd:"send"}, sendTextMessage);
    this.add({role:"sms",cmd:"save",send:"true"}, sendTextMessageWithCodeAndSave);
    this.add({role:"sms",cmd:"save",send:"false"}, createSMSCodeAndSave);
}
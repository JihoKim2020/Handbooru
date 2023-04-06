const {userDB} = require('../database/MongoDB');
bcrypt = require('bcrypt');

class signupmodel {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
        // 컨테이너에 일단 변수들을 저장
    }

    async signup() {
        const cryptedpassword = await bcrypt.hash(this.password, 12);

        const result = await userDB.insertOne({
            name: this.name,
            email: this.email,
            password: cryptedpassword
           })

           console.log(`New listing created with the following id: ${result.insertedId}`)
        }      
}

module.exports = signupmodel;
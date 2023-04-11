const {userDB} = require('../database/MongoDB');
bcrypt = require('bcrypt');

class loginmodel {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
    // new loginmodel(email, password)를 하면 이 클래스의 인스턴스가 생성된다.

    async matchuser() {
        const user = await userDB.findOne({email: this.email})
        return user
    }

    async matchpassword() { // async await 해야하는 지 모르겠네
        const user = await this.matchuser(); // this를 사용하면 이 클래스에서만 쓰이는 변수를 쓴다는 뜻!
        const cryptedpassword = user.password
        return bcrypt.compare(this.password, cryptedpassword);
    }
}

module.exports = loginmodel;
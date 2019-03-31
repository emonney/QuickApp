// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

export class UserLogin {
    constructor(userName?: string, password?: string, rememberMe?: boolean) {
        this.userName = userName;
        this.password = password;
        this.rememberMe = rememberMe;
    }

    userName: string;
    password: string;
    rememberMe: boolean;
}

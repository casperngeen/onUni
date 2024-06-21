import Cookies from "universal-cookie";

export default class Cookie {
    private readonly cookies = new Cookies(null, { path: '/', secure: true });

    public set(name: string, cookie: string) {
        this.cookies.set(name, cookie)
    }

    public get(name: string): string {
        return this.cookies.get(name)
    }

    public delete(name: string) {
        this.cookies.remove(name);
    }
}
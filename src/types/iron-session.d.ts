import "iron-session";

declare module "iron-session" {
    interface IronSessionData {
        accessToken: string | undefined;
    }
}

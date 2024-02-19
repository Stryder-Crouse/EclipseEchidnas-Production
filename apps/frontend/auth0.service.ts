import auth0 from "auth0-js";


export const webAuth = new auth0.WebAuth({
    domain: "dev-hca27okc2srfyen8.us.auth0.com",
    clientID: "BxAg6HyJiboJvAd47Mj40WepvybXVTpY",
    scope: "openid email provider",
});



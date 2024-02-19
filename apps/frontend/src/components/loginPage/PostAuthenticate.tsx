import {useEffect} from 'react';
import {useLocation} from "react-router-dom";
import {webAuth} from "../../../auth0.service.ts";
import {Auth0DecodedHash, Auth0ParseHashError, Auth0Error} from "auth0-js";

export const PostAuthenticate = () => {
    const location = useLocation();

    const processHash = (hash: string)=>{
        webAuth.parseHash({
            hash
        },function(error: Auth0ParseHashError | null, result: Auth0DecodedHash | null)
        {
            if(error){
                console.log(error);
                return;
            }
            if(result){
                const {accessToken} = result;

                if(accessToken){
                    webAuth.client.userInfo(accessToken, function(error: Auth0Error | null, result){
                        if(error) {
                            console.log(error);
                            return;
                        }

                        return result;
                    });

                    console.log('User Login Successful');
                    console.log(result);

                }
            }
        }
        );
    };

    useEffect(() => {
        if(location.hash){
            processHash(location.hash);
        }
    }, [location]);
    return;
};

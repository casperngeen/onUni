import AuthRequest from "@/utils/request/auth.request";
import RequestError from "@/utils/request/request.error";
import { AuthException, UserException } from "@/utils/request/status.code";
import { RefreshResponse } from "@/utils/request/types/auth.types";
import { ApiResponse, RequestTypes } from "@/utils/request/types/base.types";
import { useRouter } from "next/navigation";
import React, { ComponentType, createContext, useEffect, useState } from "react";

export interface AuthHOCProps {
	isVerified: boolean;
}

export const AuthContext = createContext(false);

function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
): React.FC<P> {
  return function EnhancedComponent(props: P) {
    const router = useRouter();
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
			const checkToken = async () => {
				const accessToken = localStorage.getItem("accessToken");
				if (!accessToken) {
					localStorage.removeItem("refreshToken");
					localStorage.removeItem("username");
					router.replace(`/login`);
				} else {
					try {
						await AuthRequest.validateToken({token: accessToken});
						setIsVerified(true);
					} catch (error) {
						if (error instanceof RequestError) {
							const code = error.getErrorCode();
							if (code === AuthException.EXPIRED_TOKEN) {
								const refreshToken = localStorage.getItem("refreshToken");
								if (refreshToken) {
									try {
										const refreshResponse: ApiResponse<RefreshResponse> = await fetch(
											`${process.env.NEXT_PUBLIC_API_ROUTE}/auth/refresh`,
											{
												method: RequestTypes.POST,
												headers: {
												"Content-Type": "application/json",
												Accept: "application/json",
												Authorization: `Bearer ${refreshToken}`,
												},
											},
										).then((response) => response.json());
										console.log(refreshResponse);
										if (refreshResponse.code === 0) {
											const { accessToken, refreshToken } = refreshResponse.data;
											localStorage.setItem("accessToken", accessToken);
											localStorage.setItem("refreshToken", refreshToken);
											setIsVerified(true);
										} else {
											throw new RequestError(refreshResponse.code, refreshResponse.message);
										}
									} catch (error) {
										if (error instanceof RequestError) {
											const code = error.getErrorCode();
											if (code === UserException.UNAUTHORISED_USER || code === AuthException.EXPIRED_TOKEN) {
												localStorage.removeItem("accessToken");
												localStorage.removeItem("refreshToken");
												localStorage.removeItem("username");
												router.replace(`/login`);
											}
										}
									}
								} else {
									localStorage.removeItem("accessToken");
									localStorage.removeItem("refreshToken");
									localStorage.removeItem("username");
									router.replace(`/login`);
								}
							} else if (code === UserException.UNAUTHORISED_USER) {
								localStorage.removeItem("accessToken");
								localStorage.removeItem("refreshToken");
								localStorage.removeItem("username");
								router.replace(`/login`);
							}
						}
					}
				}
			};

        checkToken();
    }, [router]);
        
	return (
		<AuthContext.Provider value={isVerified}>
			<WrappedComponent {...props}/>
		</AuthContext.Provider>
	)
  };
}

export default withAuth;

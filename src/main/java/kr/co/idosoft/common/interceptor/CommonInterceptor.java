package kr.co.idosoft.common.interceptor;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;
import org.springframework.web.util.WebUtils;

import kr.co.idosoft.intranet.login.model.service.LoginService;
import kr.co.idosoft.intranet.login.vo.SessionVO;

public class CommonInterceptor extends  HandlerInterceptorAdapter {
	
	private static final Logger LOG = LoggerFactory.getLogger(CommonInterceptor.class);
	
	@Autowired
	LoginService loginService;
	
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		if (LOG.isDebugEnabled()) {
			LOG.debug("===================       START       ===================");
			LOG.debug(" Request URI \t:  " + request.getRequestURI());
		}
		
		Map<String, Object> data = new HashMap<String, Object>();
		
		try {
			SessionVO sessionVo = null;
			HttpSession session = request.getSession();
			
			sessionVo = (SessionVO) session.getAttribute("SESSION_DATA");
			
			if (sessionVo != null && sessionVo.getMEMBER_NO() != null) {
				LOG.debug("sessionVo : " + sessionVo.toString());
				LOG.debug("### 로그인 되어있는 직원입니다.");
				return true;
			} else { // 로그인 상태 여부 판단 
				LOG.debug("### 로그인 되어있지 않은 직원입니다.");
				// 세션정보가 없으면 쿠키 정보를 확인한다.
				Cookie loginCookie = WebUtils.getCookie(request, "loginCookie");
				
				if(loginCookie != null) {
					LOG.debug("### 쿠키가 존재합니다. 자동로그인 처리 합니다.");
					HashMap<String, Object> sessionMap = new HashMap<String, Object>();
					// 쿠키에서 세션 ID를 꺼낸다.
					sessionMap.put("sessionId", loginCookie.getValue());
					
					// 세션 ID값을 기준으로 검색하여 로그인 정보를 가져온다.
					sessionVo = loginService.checkUserWithSessionKey(sessionMap);
					
					if(sessionVo != null) { // 로그인 여부 존재 여부 판단
						session.setAttribute("IS_ADMIN", sessionVo.getMANAGER_YN());
						sessionVo.setMANAGER_YN(""); // 관리자 여부 삭제
						session.setAttribute("SESSION_DATA", sessionVo);
						session.setMaxInactiveInterval(60 * 30);
						
						// 자동로그인 처리시, 자동으로 쿠키 재설정 
						// ##############################################################################
						// 쿠키를 생성하고 생성한 세션의 id를 쿠키에 저장한다
						Cookie cookie = new Cookie("loginCookie", session.getId());
						
						// 쿠키를 찾을 경로를 컨텍스트 경로로 변경한다.
						cookie.setPath("/");
						// 7일로 유효기간을 설정한다.
						cookie.setMaxAge(60*60*24*7);
						// 쿠키를 response객체에 담는다.
						response.addCookie(cookie);
						
						int amount = 60 * 60 * 24 * 7;
						Date sessionLimit = new Date(System.currentTimeMillis() + (1000 * amount));
						
						data.put("MEMBER_NO", sessionVo.getMEMBER_NO());
						data.put("sessionId", session.getId());
						data.put("sessionLimit", sessionLimit);
						
						loginService.keepLogin(data);
						// ##############################################################################
						
						return true;
					} else {
						LOG.debug("# 세션 정보가 없습니다.");
						
						response.sendError(400); // 세션 만료 에러
						return false;
					}
				} else {
					LOG.debug("# 세션 정보가 없습니다.");
					
					response.sendError(400); // 세션 만료 에러
					return false;
				}
				
			}
		} catch (Exception e) {
			LOG.debug("Exception : " + e.getMessage());
			
			response.sendError(400); // 세션 만료 에러
			return false;
		}
		
		
	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
		if (LOG.isDebugEnabled()) {
			LOG.debug("===================        END        ===================\n");
		}
	}
}

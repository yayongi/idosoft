package kr.co.idosoft.common.interceptor;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.ModelAndViewDefiningException;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import kr.co.idosoft.intranet.login.vo.SessionVO;

public class CommonInterceptor extends  HandlerInterceptorAdapter {
	
	private static final Logger LOG = LoggerFactory.getLogger(CommonInterceptor.class);
	
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
			LOG.debug("sessionVo : " + sessionVo.toString());
			
			if (sessionVo != null && sessionVo.getMEMBER_NO() != null) {
				LOG.debug("return : true");
				return true;
			} else {
				LOG.debug("return : false");
				
				response.sendError(400); // 세션 만료 에러
				return false;
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
		
		SessionVO sessionVo = null;
		HttpSession session = request.getSession();
		String requestURI = request.getRequestURI();
		try {
			if (!requestURI.equals("/index.do")) {
				sessionVo = (SessionVO) session.getAttribute("SESSION_DATA");
	
				if (sessionVo != null && sessionVo.getMEMBER_NO() != null) {
					HashMap<String, Object> menuAuthMap = (HashMap<String, Object>) modelAndView.getModel().get("menuAuth");
					/*
					 * String sessUserAuth = sessionVo.getMANAGER_YN(); String menuCode =
					 * String.valueOf(menuAuthMap.get("menuCode")); boolean authCheck = false;
					 * StringTokenizer st = new StringTokenizer(sessUserAuth, ",");
					 * 
					 * while (st.hasMoreTokens()) { String authCode = st.nextToken(); if
					 * (menuCode.equals(authCode)) { authCheck = true; } }
					 * 
					 * if (!authCheck) { ModelAndView mav = new
					 * ModelAndView("redirect:/forward.do"); mav.addObject("msgCode", "권한이 없습니다.");
					 * mav.addObject("returnUrl", "/index.do"); throw new
					 * ModelAndViewDefiningException(mav); }
					 */
				} else { // 세션이 없으면 로그인 페이지로 이동
					ModelAndView mav = new ModelAndView("redirect:/#/signIn");
					mav.addObject("msgCode", "세션이 만료되어 로그아웃 되었습니다. 다시 로그인 해주세요.");
					mav.addObject("returnUrl", "/login.do");
					throw new ModelAndViewDefiningException(mav);
				}
			}
		} catch (Exception e) { // 그 외 예외사항은 index로 이동
			/*
			 * ModelAndView mav = new ModelAndView("redirect:/forward.do");
			 * mav.addObject("msgCode", "권한이 없습니다."); mav.addObject("returnUrl",
			 * "/index.do"); throw new ModelAndViewDefiningException(mav);
			 */
		}
	}
}

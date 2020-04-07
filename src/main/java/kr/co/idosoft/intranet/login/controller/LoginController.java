package kr.co.idosoft.intranet.login.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.util.WebUtils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.idosoft.common.util.CommandMap;
import kr.co.idosoft.common.util.SHAPasswordEncoder;
import kr.co.idosoft.common.util.commonUtil;
import kr.co.idosoft.intranet.login.model.service.LoginService;
import kr.co.idosoft.intranet.login.vo.LoginVO;
import kr.co.idosoft.intranet.login.vo.SessionVO;
/**
 * 
 * @author 유기환
 * @since 2020.03.09
 * @content LOGIN controller
 */
@Controller
public class LoginController {
	private static final Logger LOG = LoggerFactory.getLogger(LoginController.class);
	
	private static final String INITPASSWORD = "idosoft1234"; // 초기비밀번호
	
	@Resource LoginService loginService;
	
	/**
	 * 로그인 처리
	 * @param model
	 * @param loginVo
	 * @param request
	 * @return data
	 */
	@RequestMapping(value="/login", method=RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> login(Model model, @RequestBody LoginVO loginVo
									, HttpServletRequest request, HttpServletResponse response, CommandMap commandMap) {
		
		if(LOG.isDebugEnabled()) {
			LOG.debug("/login");
		}
		
		HttpSession session = request.getSession();
		
		Map<String, Object> data = new HashMap<String, Object>();
		
		data.put("loginSign", "false");		// 로그인 가능 여부
		data.put("resPassSign", "false"); 	// 비밀번호 재설정 여부
		
		LOG.debug("##########################################################");

		SessionVO sessionVo = loginService.selectMemberInfo(loginVo);
		
		if(sessionVo == null) { // 해당 정보가 없을 경우,
			LOG.debug("# 해당 정보가 존재하지 않습니다.");
			return data;
		}
		
		String prevPassword = sessionVo.getPWD(); // 현재 비밀번호
		
		SHAPasswordEncoder shaPasswordEncoder = new SHAPasswordEncoder(512); // SHA512
		shaPasswordEncoder.setEncodeHashAsBase64(true);
		
		// 비밀번호 암호화 테스트 용 START ///////////////////////////////////////////////////////
		LOG.debug("# SHA512 : " + shaPasswordEncoder.encode(loginVo.getPassword()));
		LOG.debug("# 현재비밀번호 : " + loginVo.getPassword());
		LOG.debug("# 비교 : " + shaPasswordEncoder.matches(loginVo.getPassword(), prevPassword));
		// 비밀번호 암호화 테스트 용 END /////////////////////////////////////////////////////////
		if(shaPasswordEncoder.matches(loginVo.getPassword(), prevPassword)) { // 비밀번호 일치 여부
			
			// 비밀번호 초기 비밀번호 여부 체크
			if(shaPasswordEncoder.matches(INITPASSWORD, prevPassword)) {
				LOG.debug("# 초기비밀번호 입니다. 비밀번호 재설정화면으로 이동합니다. ");
				data.put("resPassSign", "true"); 
			}
			
				
			// 세션 저장
			session.setAttribute("IS_ADMIN", sessionVo.getMANAGER_YN());
			sessionVo.setMANAGER_YN("");
			
			// 비밀번호 delete
			sessionVo.setPWD("");
			sessionVo.setMANAGER_YN("");
			
			// 로그인 세션 생성
			session.setAttribute("SESSION_DATA", sessionVo);
			session.setMaxInactiveInterval(60 * 30);
			
			LOG.debug("# 로그인 유지를 선택했을 경우 START                                  #");
			// 로그인 쿠키 생성 유무 판단
			
			LOG.debug("loginVo.getIsKeepLogin() : " + loginVo.getIsKeepLogin());
			
			if("Y".equals(loginVo.getIsKeepLogin())) {
				
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
			}
			
			LOG.debug("# 로그인 유지를 선택했을 경우 END                                    #");
			LOG.debug("##########################################################");
			
			// 비밀번호 일치 여부 확인  END ////////////////////////////////////////////////////
		
			// 로그인 
			data.put("loginSign", "true");
			LOG.debug("# LOGIN FINISH ");

			
		}
		
		
		
		return data;
	}
	
	/**
	 * 로그아웃 처리
	 * @param model
	 * @param vo
	 * @return data
	 */
	@RequestMapping(value="/logout", method=RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> logout(Model model, HttpServletRequest request, HttpServletResponse response) {
		if(LOG.isDebugEnabled()) {
			LOG.debug("/logout");
		}
		
		HttpSession session = request.getSession();
		
		SessionVO sessionVo = (SessionVO) session.getAttribute("SESSION_DATA");
		
		Map<String, Object> data = new HashMap<String, Object>();
		
		Cookie loginCookie = WebUtils.getCookie(request, "loginCookie");
		
		// 쿠기 정보가 존재할 경우,
		if(loginCookie != null) {
			LOG.debug(" 쿠키가 존재합니다.");
			loginCookie.setPath("/");
			
			// 쿠키는 없앨 때 유효시간을 0으로 설정함으로써 없앨 수 있다.
			loginCookie.setMaxAge(0);
			
			response.addCookie(loginCookie);
			
			Date sessionLimit = new Date(System.currentTimeMillis());
			
			// 직원 테이블 유효기간을 현재기간으로 재설정한다.
			data.put("MEMBER_NO", sessionVo.getMEMBER_NO());
			data.put("sessionId", session.getId());
			data.put("sessionLimit", sessionLimit);
			
			loginService.keepLogin(data);
		} else {
			LOG.debug(" 쿠키가 존재하지 않습니다.");
		}
		
		// 입력 데이터 제거
		data.clear();
		// 세션 비우기
		session.invalidate();
		
		return data;
	}
	
	/**
	 * 세션 정보 JSON OBJECT 문자열로 반환
	 * @param model
	 * @param request
	 * @return data
	 */
	@RequestMapping(value="/getSession", method=RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> getSession(Model model, HttpServletRequest request) {
		if(LOG.isDebugEnabled()) {
			LOG.debug("/getSession");
		}
		
		HttpSession session = request.getSession();
		Map<String, Object> data = new HashMap<String, Object>();
		
		ObjectMapper mapper = new ObjectMapper();
		
		String jsonSessionInfoObject = null;
		
		try {
			jsonSessionInfoObject = mapper.writeValueAsString(session.getAttribute("SESSION_DATA"));
		} catch (JsonProcessingException e) {
			LOG.debug("JSON OBJECT 변환 실패 : " + e.getMessage());
		}
		
		LOG.debug("#######################################################################");
		LOG.debug("# SESSION OBJECT : " + session.getAttribute("SESSION_DATA"));
		LOG.debug("# SESSION JSON OBJECT : " + jsonSessionInfoObject);
		LOG.debug("#######################################################################");

		// 세션 데이터 저장
		data.put("SESSION_DATA", jsonSessionInfoObject);

		return data;
	}
	
	/**
	 * 비밀번호 재설정
	 * @param Map<String, Object>
	 * @param request
	 * @param params
	 * @return ModelAndView
	 */
	@RequestMapping(value="/resPassword", method=RequestMethod.POST)
	@ResponseBody
	public ModelAndView resPassword(Model model, HttpServletRequest request, @RequestBody Map<String, Object> params) {
		if(LOG.isDebugEnabled()) {
			LOG.debug("/resPassword");
		}
		
		ModelAndView mv = new ModelAndView();
		
		// ModelAndView 초기값 셋팅
		mv.setViewName("jsonView");
		mv.addObject("isError", "false");
		
		// 세션 객체 생성
		String prevPassword = (String)params.get("prevPassword");
		String password = (String)params.get("password");			// 비밀번호 
		
		if(!prevPassword.equals(password)) {
			
			mv.addObject("isError", "true");
			mv.addObject("errMessage", "비밀번호가 일치하지 않습니다.");
			
			return mv;
		}
		
		HttpSession session = request.getSession();
		
		Map<String, Object> data = new HashMap<String, Object>();

		// 세션 VO에 세션 값 저장
		SessionVO sessionVo = (SessionVO) session.getAttribute("SESSION_DATA");
		
		String mno = sessionVo.getMEMBER_NO();						// 회원번호
		
		SHAPasswordEncoder shaPasswordEncoder = new SHAPasswordEncoder(512); // SHA512
		shaPasswordEncoder.setEncodeHashAsBase64(true);
		
		// 비밀번호 암호화 처리
		password = shaPasswordEncoder.encode(password);
		
		data.put("MEMBER_NO", mno);
		data.put("PWD", password);
		
		if(loginService.updateResetPassword(data)) {
			mv.addObject("isError", "false");
		} else {
			mv.addObject("isError", "true");
			mv.addObject("errMessage", "비밀번호 재설정 오류가 발생했습니다. 관리자에게 문의해주세요.");
		}
		
		return mv;
	}
	
	/**
	 * 자동 로그인 처리
	 * @param model
	 * @param loginVo
	 * @param request
	 * @param response
	 * @return mv
	 */
	@RequestMapping(value="/autoLogin", method=RequestMethod.POST)
	@ResponseBody
	public ModelAndView autoLogin(Model model, @RequestBody LoginVO loginVo
								, HttpServletRequest request, HttpServletResponse response) {
		
		ModelAndView mv = new ModelAndView();
		
		mv.setViewName("jsonView");
		
		mv.addObject("isAutoLogin", "false");
		
		HttpSession session = request.getSession();
		
		SessionVO sessionVo = (SessionVO) session.getAttribute("SESSION_DATA");
		
		if (sessionVo != null && sessionVo.getMEMBER_NO() != null) {
			ObjectMapper mapper = new ObjectMapper();
			
			String jsonSessionInfoObject = null;
			
			try {
				jsonSessionInfoObject = mapper.writeValueAsString(sessionVo);
			} catch (JsonProcessingException e) {
				LOG.debug("JSON OBJECT 변환 실패 : " + e.getMessage());
			}
			
			LOG.debug("#######################################################################");
			LOG.debug("# SESSION OBJECT : " + session.getAttribute("SESSION_DATA"));
			LOG.debug("# SESSION JSON OBJECT : " + jsonSessionInfoObject);
			LOG.debug("#######################################################################");

			// 세션 데이터 저장
			mv.addObject("SESSION_DATA", jsonSessionInfoObject);
			
			LOG.debug("### 로그인 되어있는 직원입니다.");
			mv.addObject("isAutoLogin", "true");
		}
		
		return mv;
	}
	
	/**
	 * 관리자 여부
	 * @param model
	 * @param loginVo
	 * @param request
	 * @param response
	 * @return mv
	 */
	@RequestMapping(value="/getIsAdmin", method=RequestMethod.POST)
	@ResponseBody
	public ModelAndView getIsAdmin(Model model, @RequestBody LoginVO loginVo
								, HttpServletRequest request, HttpServletResponse response) {
		
		ModelAndView mv = new ModelAndView();
		
		mv.setViewName("jsonView");
		
		mv.addObject("isAdmin", "false");
		
		HttpSession session = request.getSession();
		
		if (commonUtil.isAdmin(session)) {
			
			// 세션 데이터 저장
			mv.addObject("isAdmin", "true");
		}
		
		return mv;
	}
}

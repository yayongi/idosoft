package kr.co.idosoft.intranet.login.controller;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.co.idosoft.common.util.SHAPasswordEncoder;
import kr.co.idosoft.intranet.login.service.LoginService;
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
	@Resource LoginService loginService;
	
	/**
	 * 로그인 처리
	 * @param model
	 * @param vo
	 * @return data
	 */
	@RequestMapping(value="/login", method=RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> login(Model model, @RequestBody LoginVO loginVo, HttpServletRequest request) {
		if(LOG.isDebugEnabled()) {
			LOG.debug("/login");
		}
		
		HttpSession session = request.getSession();
		
		Map<String, Object> data = new HashMap<String, Object>();

		LOG.debug("##########################################################");

		SessionVO sessionVo = loginService.selectMemberInfo(loginVo);
		
		if(sessionVo == null) { // 해당 정보가 없을 경우,
			data.put("loginSign", "false");
			return data;
		}
		
		String prevPassword = sessionVo.getPassword(); // 현재 비밀번호
		
		SHAPasswordEncoder shaPasswordEncoder = new SHAPasswordEncoder(512); // SHA512
		shaPasswordEncoder.setEncodeHashAsBase64(true);
		
		// 비밀번호 암호화 테스트 용 START ///////////////////////////////////////////////////////
		LOG.debug("SHA512 : " + shaPasswordEncoder.encode(loginVo.getPassword()));
		LOG.debug("현재비밀번호 : " + loginVo.getPassword());
		LOG.debug("비교 : " + shaPasswordEncoder.matches(loginVo.getPassword(), prevPassword));
		// 비밀번호 암호화 테스트 용 END /////////////////////////////////////////////////////////
		if(shaPasswordEncoder.matches(loginVo.getPassword(), prevPassword)) { // 비밀번호 일치 여부
			// 비밀번호 delete
			sessionVo.setPassword("");
			// 세션 저장
			session.setAttribute("SESSION_DATA", sessionVo);
			data.put("loginSign", "true");
		} else {
			data.put("loginSign", "false");
		}
		
		// 비밀번호 일치 여부 확인  END ////////////////////////////////////////////////////
		LOG.debug("session : " + session.getAttribute("SESSION_DATA").toString() + "#############################");
		LOG.debug("sessionVO : " + sessionVo + "#############################");
		LOG.debug("##########################################################");

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
	public Map<String, Object> logout(Model model, HttpServletRequest request) {
		if(LOG.isDebugEnabled()) {
			LOG.debug("/logout");
		}
		
		HttpSession session = request.getSession();
		Map<String, Object> data = new HashMap<String, Object>();
		
		// 세션 비우기
		session.invalidate();

		return data;
	}
}

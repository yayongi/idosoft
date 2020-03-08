package kr.co.idosoft.intranet.login.controller;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;


import kr.co.idosoft.demo.vo.TodoVO;
import kr.co.idosoft.intranet.login.vo.LoginVO;

/**
 * 일정관리를 위한 컨트롤러
 * @author 유기환
 */
@Controller
public class LoginController {
	private static final Logger LOG = LoggerFactory.getLogger(LoginController.class);
	//@Resource TodoService service;
	
	/**
	 * 로그인 처리
	 * @param model
	 * @param vo
	 * @return
	 */
	@RequestMapping(value="/login.ido", method=RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> login(Model model, @RequestParam String email, @RequestParam String password) {
		if(LOG.isDebugEnabled()) {
			LOG.debug("/login");
		}
		
		LOG.debug("##########################################################");
		LOG.debug("email : " + email + " ####################################");
		LOG.debug("password : " + password + " ##############################");
		
		// SHA 512 암호화 처리 START ////////////////////////////////////////////////
		String raw = password;
		String hex = "";
		SecureRandom random;
		
		try {
			random = SecureRandom.getInstance("SHA1PRNG");
			byte[] bytes = new byte[16];
			random.nextBytes(bytes);
			String salt = new String(Base64.getEncoder().encode(bytes));
			
			MessageDigest md = MessageDigest.getInstance("SHA-512");
			md.update(salt.getBytes());
			md.update(raw.getBytes());
			
			hex = String.format("%064x", new BigInteger(1, md.digest()));
			
			// SHA 512 암호화 처리 END ////////////////////////////////////////////////
		} catch (NoSuchAlgorithmException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		LOG.debug("hex : " + hex + " ########################################");
		LOG.debug("##########################################################");

		LoginVO loginInfo = new LoginVO();
		
		loginInfo.setEmail(email);
		loginInfo.setPassword(hex);

		Map<String, Object> data = new HashMap<String, Object>();
		// 일정목록 조회
		//List<TodoVO> todoList = service.selectTodoList();
		
		//data.put("todoList", todoList);
		
		
		return data;
	}
	
	
}

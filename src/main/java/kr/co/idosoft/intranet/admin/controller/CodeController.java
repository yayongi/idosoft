package kr.co.idosoft.intranet.admin.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.idosoft.common.util.JsonUtils;
import kr.co.idosoft.intranet.admin.model.service.CodeServiceImpl;
import kr.co.idosoft.intranet.login.vo.SessionVO;

@Controller
public class CodeController {
	private static final Logger LOG = LoggerFactory.getLogger(CodeController.class);
	
	@Resource CodeServiceImpl codeService;
	
	
	@RequestMapping(value="/allCode",method=RequestMethod.POST)
	@ResponseBody
	public ModelAndView allCode(HttpServletRequest request, @RequestBody Map<String, Object> params ){
		LOG.debug("allCode Start");
		
		ModelAndView mv = new ModelAndView();
		
		// ModelAndView 초기값 셋팅
		mv.setViewName("jsonView");
		mv.addObject("isError", "false");				// 에러를 발생시켜야할 경우,
		mv.addObject("isNoN", "false");					// 목록이 비어있는 경우,
		
		List<Map<String, Object>> list = codeService.getlist();
		int listCount = codeService.getlistCount();
		
		String jsonArrayList 	= null;
		String jsonObjectData 	= null;
		
		try {
			jsonArrayList = JsonUtils.getJsonStringFromList(list); 	// JSONARRAY 변환
			//jsonObjectData = mapper.writeValueAsString(data); 		// JSONOBJECT 변환
		} catch (Exception e) {
			LOG.debug("JSON OBJECT 변환 실패 : " + e.getMessage());
		}
		
		
		mv.addObject("list", jsonArrayList);
		mv.addObject("list_count", listCount);
		LOG.debug("JSON OBJECT 변환 실패 : " + list);
		mv.addObject("result", jsonObjectData);
		return mv;
	}
	
	@RequestMapping(value="/addNewCode",method=RequestMethod.POST)
	@ResponseBody
	public ModelAndView addNewCode(HttpServletRequest request, @RequestBody Map<String, Object> params ){
		LOG.debug("addNewCode Start");
		for (String key : params.keySet()) {
	        LOG.debug("key : " + key);
	        LOG.debug("value : " + params.get(key));
	    }
		
		ModelAndView mv = new ModelAndView();
		
		// ModelAndView 초기값 셋팅
		mv.setViewName("jsonView");
		mv.addObject("isError", "false");				// 에러를 발생시켜야할 경우,
		mv.addObject("isNoN", "false");					// 목록이 비어있는 경우,
		
		// 검색 조건 제외하고 개발중..
		
		String jsonArrayList 	= null;
		String jsonObjectData 	= null;
		
		HttpSession session = request.getSession();
		
		SessionVO sessionVo = (SessionVO) session.getAttribute("SESSION_DATA");	// 세션 정보
		String mno = sessionVo.getMEMBER_NO();									// 로그인 회원번호
		params.put("REG_ID", mno);		//등록자 사번 추가
		
		boolean result = true;
		try {
			codeService.insert(params);
		}catch(Exception e) {
			result = false;
		}
		
		mv.addObject("isSuccess", result);
		mv.addObject("result", jsonObjectData);
		
		return mv;
	}
	
	@RequestMapping(value="/deleteCode",method=RequestMethod.POST)
	@ResponseBody
	public ModelAndView deleteCode(HttpServletRequest request, @RequestBody Map<String, Object> params ){
		LOG.debug("addNewCode Start");
		for (String key : params.keySet()) {
	        System.out.print("key : " + key);
	        System.out.print("value : " + params.get(key));
	    }
		
		ModelAndView mv = new ModelAndView();
		
		// ModelAndView 초기값 셋팅
		mv.setViewName("jsonView");
		mv.addObject("isError", "false");				// 에러를 발생시켜야할 경우,
		mv.addObject("isNoN", "false");					// 목록이 비어있는 경우,
		
		// 검색 조건 제외하고 개발중..
		
		String jsonArrayList 	= null;
		String jsonObjectData 	= null;
		
		HttpSession session = request.getSession();
		
		SessionVO sessionVo = (SessionVO) session.getAttribute("SESSION_DATA");	// 세션 정보
		String mno = sessionVo.getMEMBER_NO();									// 로그인 회원번호
		params.put("REG_ID", mno);		//등록자 사번 추가
		
		boolean result = true;
		try {
			codeService.deleteInfo((String)params.get("CODE_ID"));
		}catch(Exception e) {
			result = false;
		}
		
		mv.addObject("isSuccess", result);
		mv.addObject("result", jsonObjectData);
		
		return mv;
	}
	
	@RequestMapping(value="/updateCode",method=RequestMethod.POST)
	@ResponseBody
	public ModelAndView updateCode(HttpServletRequest request, @RequestBody Map<String, Object> params ){
		LOG.debug("updateCode Start");
		for (String key : params.keySet()) {
	        System.out.print("key : " + key);
	        System.out.print("value : " + params.get(key));
	    }
		
		ModelAndView mv = new ModelAndView();
		
		// ModelAndView 초기값 셋팅
		mv.setViewName("jsonView");
		mv.addObject("isError", "false");				// 에러를 발생시켜야할 경우,
		mv.addObject("isNoN", "false");					// 목록이 비어있는 경우,
		
		// 검색 조건 제외하고 개발중..
		
		String jsonArrayList 	= null;
		String jsonObjectData 	= null;
		
		HttpSession session = request.getSession();
		
		SessionVO sessionVo = (SessionVO) session.getAttribute("SESSION_DATA");	// 세션 정보
		String mno = sessionVo.getMEMBER_NO();									// 로그인 회원번호
		params.put("UPD_ID", mno);		//등록자 사번 추가
		
		boolean result = true;
		try {
			codeService.update(params);
		}catch(Exception e) {
			result = false;
		}
		
		mv.addObject("isSuccess", result);
		mv.addObject("result", jsonObjectData);
		
		return mv;
	}
}

package kr.co.idosoft.intranet.project.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
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
import kr.co.idosoft.intranet.member.model.service.MemberServiceImpl;
import kr.co.idosoft.intranet.project.model.service.ProjectServiceImpl;

@Controller
public class ProjectController {
	private static final Logger LOG = LoggerFactory.getLogger(ProjectController.class);
	
	@Resource ProjectServiceImpl projectService;	//프로젝트 정보
	@Resource CodeServiceImpl codetService;			//코드정보
	@Resource MemberServiceImpl memberService;		//멤버정보
	
	
	@RequestMapping(value="/allProject",method=RequestMethod.POST)
	@ResponseBody
	public ModelAndView allProject(HttpServletRequest request, @RequestBody Map<String, Object> params ){
		ModelAndView mv = new ModelAndView();
		
		// ModelAndView 초기값 셋팅
		mv.setViewName("jsonView");
		mv.addObject("isError", "false");				// 에러를 발생시켜야할 경우,
		mv.addObject("isNoN", "false");					// 목록이 비어있는 경우,
		
		// 검색 조건 제외하고 개발중..
		Map<String, Object> data = new HashMap<>();
		
		//List<Map<String, Object>> list = historyService.selectList();
		
		String jsonArrayList 	= null;
		String jsonObjectData 	= null;
		
		//jsonArrayList = JsonUtils.getJsonStringFromList(); 	// JSONARRAY 변환
		
		mv.addObject("list", jsonArrayList);
		mv.addObject("result", jsonObjectData);
		
		return mv;
	}
	
	//code list, member list, project info를 가져온다 
	//신규프로젝트 등록, (프로젝트 수정, 프로젝트 삭제 기능에서 프로젝트 정보 조회)
	@RequestMapping(value="/projectInfo",method=RequestMethod.POST)
	@ResponseBody
	public ModelAndView projectInfo(HttpServletRequest request, @RequestBody Map<String, Object> params ){
		ModelAndView mv = new ModelAndView();
		
		// ModelAndView 초기값 셋팅
		mv.setViewName("jsonView");
		mv.addObject("isError", "false");				// 에러를 발생시켜야할 경우,
		mv.addObject("isNoN", "false");					// 목록이 비어있는 경우,
		
		// 검색 조건 제외하고 개발중..
		Map<String, Object> data = new HashMap<>();
		
		//List<Map<String, Object>> list = historyService.selectList();
		
		String jsonArrayList 	= null;
		String jsonObjectData 	= null;
		
		//jsonArrayList = JsonUtils.getJsonStringFromList(); 	// JSONARRAY 변환
		
		mv.addObject("list", jsonArrayList);
		mv.addObject("result", jsonObjectData);
		
		return mv;
	}
}

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
		
		List<Map<String, Object>> project_list = projectService.selectAllList();
		
		List<Map<String, Object>> code_list = codetService.getLowCodeList((String) params.get("CODE_ID"));
		
		mv.addObject("project_list", project_list);
		mv.addObject("code_list", code_list);
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
		//String jsonObjectData 	= null;
		
		
		List<Map<String, Object>> code_list = codetService.getLowCodeList((String) params.get("CODE_ID"));
		//jsonArrayList = JsonUtils.getJsonStringFromList(code_list); 	// JSONARRAY 변환
		
		List<Object> member_list = memberService.selectMemberList();
		
		mv.addObject("code_list", code_list);
		mv.addObject("member_list", member_list);
		
		return mv;
	}
	
	@RequestMapping(value="/insertProject",method=RequestMethod.POST)
	@ResponseBody
	public ModelAndView insertProject(HttpServletRequest request, @RequestBody Map<String, Object> params ){
		ModelAndView mv = new ModelAndView();
		
		// ModelAndView 초기값 셋팅
		mv.setViewName("jsonView");
		mv.addObject("isError", "false");				// 에러를 발생시켜야할 경우,
		mv.addObject("isNoN", "false");					// 목록이 비어있는 경우,
		
		HttpSession session = request.getSession();
		
		SessionVO sessionVo = (SessionVO) session.getAttribute("SESSION_DATA");	// 세션 정보
		String mno = sessionVo.getMEMBER_NO();									// 로그인 회원번호
		params.put("REG_ID", mno);		//등록자 사번 추가
		params.put("BGNDE", ((String)params.get("BGNDE")).replace("-", ""));
		params.put("ENDDE", ((String)params.get("ENDDE")).replace("-", ""));
		
		boolean db_result = false;
		try {
			
			projectService.insert((HashMap<String, Object>)params);
		}catch(Exception e) {
			LOG.debug("디비 에러남 DB ERROR");
			db_result = true;
		}
		mv.addObject("isDBError", db_result);
		return mv;
	}
}

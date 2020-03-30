package kr.co.idosoft.intranet.project.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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
		List<String> inputCodeList = (List<String>)params.get("CODE_ID");
		
		List<Map<String, Object>> code_list = codetService.getLowCodeList(inputCodeList.get(0));
		List<Map<String, Object>> role_list = codetService.getLowCodeList(inputCodeList.get(1));
		//jsonArrayList = JsonUtils.getJsonStringFromList(code_list); 	// JSONARRAY 변환
		
		List<Object> member_list = memberService.selectMemberList();
		
		mv.addObject("code_list", code_list);
		mv.addObject("role_list", role_list);
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
		
		HashMap<String, Object> dataState  = (HashMap<String, Object>)params.get("dataState");		//프로젝트 정보
		List<HashMap<String, Object>> mdataState = (List<HashMap<String, Object>>)params.get("memDataState");	//프로젝트 투입인원 정보
		
		HttpSession session = request.getSession();
		SessionVO sessionVo = (SessionVO) session.getAttribute("SESSION_DATA");	// 세션 정보
		String mno = sessionVo.getMEMBER_NO();									// 로그인 회원번호
		dataState.put("REG_ID", mno);		//등록자 사번 추가
		dataState.put("BGNDE", ((String)dataState.get("BGNDE")).replace("-", ""));
		dataState.put("ENDDE", ((String)dataState.get("ENDDE")).replace("-", ""));
		
		boolean db_result = false;
		try {
			projectService.insert((HashMap<String, Object>)dataState);
			
			String project_no = projectService.selectMaxProject();
			for(HashMap<String, Object> tmp : mdataState) {
				tmp.put("PROJECT_NO", project_no);
				tmp.put("REG_ID", mno);
				tmp.put("INPT_BGNDE", ((String)tmp.get("INPT_BGNDE")).replace("-", ""));
				tmp.put("INPT_ENDDE", ((String)tmp.get("INPT_ENDDE")).replace("-", ""));
				try {
					projectService.insertProjectMember(tmp);
				}catch(Exception e) {
					continue;
				}
			}
			
		}catch(Exception e) {
			LOG.debug("디비 에러남 DB ERROR");
			db_result = true;
		}
		mv.addObject("isDBError", db_result);
		return mv;
	}
	
	@RequestMapping(value="/projectDashboard",method=RequestMethod.POST)
	@ResponseBody
	public List<HashMap<String, String>> projectDashboard(Model model, HttpServletRequest request){
		// 현재 진행 중이 프로젝트 목록 호출
		List<HashMap<String, String>> tempProject = new ArrayList<HashMap<String, String>>();
		tempProject = projectService.getPresentProject();
		
		// 현재 투입중인 프로젝트 인원
		List<HashMap<String, String>> tempProjectMember = new ArrayList<HashMap<String, String>>();
		tempProjectMember = projectService.getProjectMember();
		
		List<HashMap<String, String>> resultList = new ArrayList<HashMap<String, String>>();
		
		
		for(int i = 0; i<tempProject.size(); i++) {
			int count = 0;
			HashMap<String, String> tempMap = tempProject.get(i);
			String projectNo = String.valueOf(tempMap.get("PROJECT_NO"));
			LOG.debug("projectNo : " + projectNo);
			for(int j = 0; j<tempProjectMember.size(); j++) {
				HashMap<String, String> tempMemberMap = tempProjectMember.get(j);
				String projectMemberNo = String.valueOf(tempMemberMap.get("PROJECT_NO"));
				LOG.debug("result : " + projectNo.equals(projectMemberNo));
				if(projectNo.equals(projectMemberNo)) {
					count += 1;
				}
			}
			tempMap.put("PROJECT_NO",String.valueOf(tempMap.get("PROJECT_NO")));
			tempMap.put("memberCount",String.valueOf(count));
			resultList.add(tempMap);
		}
		
		LOG.debug("result : " + resultList);
		return resultList;
	}
}

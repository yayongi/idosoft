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

import kr.co.idosoft.common.util.commonUtil;
import kr.co.idosoft.intranet.admin.model.service.CodeServiceImpl;
import kr.co.idosoft.intranet.login.vo.SessionVO;
import kr.co.idosoft.intranet.member.model.service.MemberServiceImpl;
import kr.co.idosoft.intranet.member.vo.MemberVO;
import kr.co.idosoft.intranet.project.model.service.ProjectServiceImpl;

@Controller
public class ProjectController {
	private static final Logger LOG = LoggerFactory.getLogger(ProjectController.class);
	
	@Resource ProjectServiceImpl projectService;	//프로젝트 정보
	
	
	@RequestMapping(value="/allProject",method=RequestMethod.POST)
	@ResponseBody
	public ModelAndView allProject(HttpServletRequest request, @RequestBody Map<String, Object> params ){
		ModelAndView mv = new ModelAndView();
		
		// ModelAndView 초기값 셋팅
		mv.setViewName("jsonView");
		mv.addObject("isError", "false");				// 에러를 발생시켜야할 경우,
		mv.addObject("isNoN", "false");					// 목록이 비어있는 경우,
		
		List<MemberVO> member_list = projectService.selectMemberList();
		List<Map<String, Object>> instt_list = projectService.getLowCodeList((String)params.get("CODE_ID"));
		
		HttpSession session = request.getSession();
		boolean isAdmin = commonUtil.isAdmin(session);
		
		HashMap<String, Object> conditions = (HashMap<String, Object>)params.get("condition");
		for (String key :conditions.keySet()) { 
			LOG.debug("key : " + key); 
			LOG.debug("value : " + conditions.get(key)); 
		} 
		
		HashMap<String, Object> condition = new HashMap<String, Object>();
		List<Map<String, Object>> hist_list = new ArrayList<Map<String, Object>>();
		List<HashMap<String, Object>> graph_list = new ArrayList<HashMap<String, Object>>();
		//전체 검색
		if("0".equals(conditions.get("searchType"))) {
			hist_list = projectService.selectAllList(condition);
			graph_list = projectService.getGraphInfo(condition);
		}
		//특정 날짜 검색
		else if("1".equals(conditions.get("searchType"))) {
			LOG.debug("select_date : " + conditions.get("select_date")); 
			condition.put("SELDATE", conditions.get("select_date"));
			hist_list = projectService.selectAllList(condition);
			graph_list = projectService.getGraphInfo(condition);
		}
		//연도 검색
		else if("2".equals(conditions.get("searchType"))) {
			LOG.debug("key SELYEAR select_detail : " + conditions.get("select_detail")); 
			condition.put("SELYEAR", conditions.get("select_detail"));
			hist_list = projectService.selectAllList(condition);
			graph_list = projectService.getGraphInfo(condition);
		}
		//발주처 검색
		else if("3".equals(conditions.get("searchType"))) {
			LOG.debug("key SELYEAR select_detail : " + conditions.get("select_detail")); 
			condition.put("SELINSTT", conditions.get("select_detail"));
			hist_list = projectService.selectForList(condition);
			graph_list = projectService.getGraphForInfo(condition);
		}
		//사원명 검색
		else if("4".equals(conditions.get("searchType"))) {
			condition.put("SELMEMBER", conditions.get("select_detail"));
			hist_list = projectService.selectForList(condition);
			graph_list = projectService.getGraphForInfo(condition);
		}
		
		
		
		mv.addObject("hist_list", hist_list);
		mv.addObject("graph_list", graph_list);
		mv.addObject("member_list", member_list);
		mv.addObject("instt_list", instt_list);
		mv.addObject("isAdmin", isAdmin);
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
		
		
		String jsonArrayList 	= null;
		//String jsonObjectData 	= null;
		List<String> inputCodeList = (List<String>)params.get("CODE_ID");
		
		List<Map<String, Object>> code_list = projectService.getLowCodeList(inputCodeList.get(0));
		List<Map<String, Object>> role_list = projectService.getLowCodeList(inputCodeList.get(1));
		List<MemberVO> member_list = projectService.selectMemberList();
		
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
				projectService.insertProjectMember(tmp);
			}
			
		}catch(Exception e) {
			LOG.debug("디비 에러남 DB ERROR");
			db_result = true;
		}
		mv.addObject("isDBError", db_result);
		return mv;
	}
	
	@RequestMapping(value="/projectDetailInfo",method=RequestMethod.POST)
	@ResponseBody
	public ModelAndView projectDetailInfo(HttpServletRequest request, @RequestBody Map<String, Object> params ){
		ModelAndView mv = new ModelAndView();
		
		// ModelAndView 초기값 셋팅
		mv.setViewName("jsonView");
		mv.addObject("isError", "false");				// 에러를 발생시켜야할 경우,
		mv.addObject("isNoN", "false");					// 목록이 비어있는 경우,
		
		Map<String, Object> project_info = new HashMap<String, Object>();
		List<Map<String, Object>> proMemList = new ArrayList<Map<String, Object>>();
		List<Map<String, Object>> code_list = new ArrayList<Map<String, Object>>();
		List<Map<String, Object>> role_list = new ArrayList<Map<String, Object>>();
		List<MemberVO> member_list = new ArrayList<MemberVO>();
		String project_no = (String)params.get("PROJECT_NO");
		boolean db_result = false;
		try {
			project_info = projectService.selectInfo(project_no);
			proMemList = projectService.projectMemberList(project_no);
			code_list =  projectService.getLowCodeList("CD0008");
			role_list =  projectService.getLowCodeList("CD0009");
			member_list = projectService.selectMemberList();
		}catch(Exception e) {
			LOG.debug("디비 에러남 DB ERROR");
			LOG.debug(e.toString());
			db_result = true;
		}
		
		mv.addObject("project_info", project_info);
		mv.addObject("proMemList", proMemList);
		mv.addObject("code_list", code_list);
		mv.addObject("role_list", role_list);
		mv.addObject("member_list", member_list);
		mv.addObject("isDBError", db_result);
		return mv;
	}
	
	
	@RequestMapping(value="/updateProjectInfo",method=RequestMethod.POST)
	@ResponseBody
	public ModelAndView updateProjectInfo(HttpServletRequest request, @RequestBody Map<String, Object> params ){
		ModelAndView mv = new ModelAndView();
		
		// ModelAndView 초기값 셋팅
		mv.setViewName("jsonView");
		mv.addObject("isError", "false");				// 에러를 발생시켜야할 경우,
		mv.addObject("isNoN", "false");					// 목록이 비어있는 경우,
		
		HttpSession session = request.getSession();
		SessionVO sessionVo = (SessionVO) session.getAttribute("SESSION_DATA");	// 세션 정보
		String mno = sessionVo.getMEMBER_NO();									// 로그인 회원번호
		HashMap<String, Object> dataState  = ((HashMap<String, Object>)params.get("dataState"));		//프로젝트 정보
		dataState.put("UPD_ID", mno);		//등록자 사번 추가
		dataState.put("BGNDE", ((String)dataState.get("BGNDE")).replace("-", ""));
		dataState.put("ENDDE", ((String)dataState.get("ENDDE")).replace("-", ""));
		
		
		List<HashMap<String, Object>> member_list = ((List<HashMap<String, Object>>)params.get("memDataState"));
		
		LOG.debug("디비 에러남 DB ERROR");
		for (String key : dataState.keySet()) {
	        LOG.debug("key : " + key);
	        LOG.debug("value : " + dataState.get(key));
	    }
		LOG.debug("디비 에러남 DB ERROR");
		
		
		boolean db_result = false;
		try {
			projectService.update(dataState);
		}catch(Exception e) {
			LOG.debug("디비 에러남 DB ERROR");
			LOG.debug(e.toString());
			db_result = true;
		}
		
		mv.addObject("isDBError", db_result);
		return mv;
	}
	
	@RequestMapping(value="/removeProject",method=RequestMethod.POST)
	@ResponseBody
	public ModelAndView removeProject(HttpServletRequest request, @RequestBody Map<String, Object> params ){
		ModelAndView mv = new ModelAndView();
		
		// ModelAndView 초기값 셋팅
		mv.setViewName("jsonView");
		mv.addObject("isError", "false");				// 에러를 발생시켜야할 경우,
		mv.addObject("isNoN", "false");					// 목록이 비어있는 경우,
		
		boolean db_result = false;
		try {
			projectService.deleteInfo((String)params.get("PROJECT_NO"));
			projectService.removeMemberForPro((String)params.get("PROJECT_NO"));
		}catch(Exception e) {
			LOG.debug("디비 에러남 DB ERROR");
			LOG.debug(e.toString());
			db_result = true;
		}
		
		mv.addObject("isDBError", db_result);
		return mv;
	}
	
	@RequestMapping(value="/updateMember",method=RequestMethod.POST)
	@ResponseBody
	public ModelAndView updateMember(HttpServletRequest request, @RequestBody Map<String, Object> params ){
		ModelAndView mv = new ModelAndView();
		
		// ModelAndView 초기값 셋팅
		mv.setViewName("jsonView");
		mv.addObject("isError", "false");				// 에러를 발생시켜야할 경우,
		mv.addObject("isNoN", "false");					// 목록이 비어있는 경우,
		
		boolean db_result = false;
		try {
			projectService.updateMember((HashMap<String, Object>) params.get("memDataState"));
		}catch(Exception e) {
			LOG.debug("디비 에러남 DB ERROR");
			LOG.debug(e.toString());
			db_result = true;
		}
		
		mv.addObject("isDBError", db_result);
		return mv;
	}
	@RequestMapping(value="/removeMember",method=RequestMethod.POST)
	@ResponseBody
	public ModelAndView removeMember(HttpServletRequest request, @RequestBody Map<String, Object> params ){
		ModelAndView mv = new ModelAndView();
		
		// ModelAndView 초기값 셋팅
		mv.setViewName("jsonView");
		mv.addObject("isError", "false");				// 에러를 발생시켜야할 경우,
		mv.addObject("isNoN", "false");					// 목록이 비어있는 경우,
		// 현재 진행 중이 프로젝트 목록 호출
		boolean db_result = false;
		try {
			projectService.removeMember((HashMap<String, Object>)params);
		}catch(Exception e) {
			LOG.debug("디비 에러남 DB ERROR");
			LOG.debug(e.toString());
			db_result = true;
		}
		
		mv.addObject("isDBError", db_result);
		return mv;
	}
	
	@RequestMapping(value="/addMember",method=RequestMethod.POST)
	@ResponseBody
	public ModelAndView addMember(HttpServletRequest request, @RequestBody Map<String, Object> params ){
		ModelAndView mv = new ModelAndView();
		
		// ModelAndView 초기값 셋팅
		mv.setViewName("jsonView");
		mv.addObject("isError", "false");				// 에러를 발생시켜야할 경우,
		mv.addObject("isNoN", "false");					// 목록이 비어있는 경우,
		
		HttpSession session = request.getSession();
		SessionVO sessionVo = (SessionVO) session.getAttribute("SESSION_DATA");	// 세션 정보
		String mno = sessionVo.getMEMBER_NO();									// 로그인 회원번호
		params.put("REG_ID", mno);		//등록자 사번 추가
		
		
		// 현재 진행 중이 프로젝트 목록 호출
		boolean db_result = false;
		try {
			projectService.insertProjectMember((HashMap<String, Object>)params);
		}catch(Exception e) {
			LOG.debug("디비 에러남 DB ERROR");
			LOG.debug(e.toString());
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
			for(int j = 0; j<tempProjectMember.size(); j++) {
				HashMap<String, String> tempMemberMap = tempProjectMember.get(j);
				String projectMemberNo = String.valueOf(tempMemberMap.get("PROJECT_NO"));
				if(projectNo.equals(projectMemberNo)) {
					count += 1;
				}
			}
			tempMap.put("PROJECT_NO",String.valueOf(tempMap.get("PROJECT_NO")));
			tempMap.put("memberCount",String.valueOf(count));
			resultList.add(tempMap);
		}
		
		return resultList;
	}
}

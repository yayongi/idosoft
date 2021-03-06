package kr.co.idosoft.intranet.project.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
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
import kr.co.idosoft.intranet.login.vo.SessionVO;
import kr.co.idosoft.intranet.member.vo.MemberVO;
import kr.co.idosoft.intranet.project.model.service.HistoryServiceImpl;

@Controller
public class HistoryController {
	
private static final Logger LOG = LoggerFactory.getLogger(HistoryController.class);
	
	@Resource HistoryServiceImpl historyService;
	
	@RequestMapping(value="/allHistory",method=RequestMethod.POST)
	@ResponseBody
	public ModelAndView allHistory(HttpServletRequest request, @RequestBody Map<String, Object> params ){
		
		HttpSession session = request.getSession();
		SessionVO sessionVo = (SessionVO) session.getAttribute("SESSION_DATA");	// 세션 정보
		//boolean isAdmin = commonUtil.isAdmin(session);
		//String member_no = "";
		
		ModelAndView mv = new ModelAndView();
		
		// ModelAndView 초기값 셋팅
		mv.setViewName("jsonView");
		mv.addObject("isError", "false");				// 에러를 발생시켜야할 경우,
		mv.addObject("isNoN", "false");					// 목록이 비어있는 경우,
		
		//ArrayList<Map<String, Object>> history_list = new ArrayList<Map<String, Object>>();
		//List<HashMap<String, Object>> memberList = new ArrayList<HashMap<String, Object>>();	
		//String select_member = (String)params.get("select_member");
		/*
		try {
			//관리자면 멤버 전체를 가져온다.
			if(isAdmin) {
				member_get_list = historyService.selectMemberList();
				//선택된 계정이 없으면 전체를 가져온다.
				if("".equals(select_member)) {
					member_no = null;
				}else {
					member_no = select_member;
				}
			}else {
				member_no = sessionVo.getMEMBER_NO();
			}
			history_list = (ArrayList<Map<String, Object>>)historyService.selectHistory(member_no);
			
		} catch (Exception e) {
			LOG.debug("JSON OBJECT 변환 실패 : " + e.getMessage());
		}
		mv.addObject("member_list", member_get_list);
		mv.addObject("history_list", history_list);
		*/
		
		//사원 목록을 조회한다.
		List<MemberVO> member_get_list = new ArrayList<MemberVO>();
		List<MemberVO> member_res_list = new ArrayList<MemberVO>();
		//선택된 사원의 이력 정보를 조회한다.
		List<Map<String, Object>> me_history_list = new ArrayList<Map<String, Object>>();
		boolean db_result = false;
		try {
			String member_no = sessionVo.getMEMBER_NO();
			String select_member = (String)params.get("select_member");
			if(!"".equals(select_member)) {
				member_no = select_member;
			}
			me_history_list = historyService.selectHistory(member_no);
			//member_get_list = historyService.selectMemberList();
			
			//멤버 리스트에서 퇴사자를 삭제하고 화면에 내려준다 (경리의 경우 스크립트로 한번 더 삭제한다)
			//퇴사자의 경우 
			for(int i=0; i < member_get_list.size(); i++) {
				if(!"".equals(member_get_list.get(i).getRet_date()) || member_get_list.get(i).getRet_date() != null){
					LOG.debug("퇴사자 : " + member_get_list.get(i));
				}else {
					member_res_list.add(member_get_list.get(i));
				}
			}
		} catch (Exception e) {
			LOG.debug("JSON OBJECT 변환 실패 : " + e.getMessage());
			db_result = true;
		}
		
		mv.addObject("isDBError", db_result);
		mv.addObject("history_list", me_history_list);
		mv.addObject("member_list", member_res_list);
		return mv;
	}
	
	//관리자 여부 확인
	@RequestMapping(value="/history/isAdmin",method=RequestMethod.POST)
	@ResponseBody
	public LinkedHashMap<String,Object> isAdmin(HttpServletRequest request,HttpSession session){
		LinkedHashMap<String, Object> tempMap = new LinkedHashMap<String, Object>();
		tempMap.put("isAdmin", commonUtil.isAdmin(session));
		return tempMap;
	}
	
	//직원 명단 가져오기
	@RequestMapping(value="/history/memberList",method=RequestMethod.POST)
	@ResponseBody
	public List<LinkedHashMap<String,Object>> memberList(HttpServletRequest request){
		return historyService.memberList();
	}
	
	// 이력 상세 정보가져오기
	@RequestMapping(value="/history/getinfo", method=RequestMethod.POST)
	@ResponseBody
	public LinkedHashMap<String, Object> getinfo(Model model, @RequestBody LinkedHashMap<String, Object> data, HttpServletRequest request,HttpSession session){
		try {
			return historyService.getinfo(data);
		}catch(Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	// 직무 가져오기
	@RequestMapping(value="/history/getrolelist", method=RequestMethod.POST)
	@ResponseBody
	public List<LinkedHashMap<String, Object>> getrolelist(Model model, HttpServletRequest request,HttpSession session){
		try {
			return historyService.getrolelist();
		}catch(Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	// 프로젝트 업체 가져오기
	@RequestMapping(value="/history/getcompany", method=RequestMethod.POST)
	@ResponseBody
	public LinkedHashMap<String, Object> getcompany(Model model, @RequestBody LinkedHashMap<String, Object> data, HttpServletRequest request,HttpSession session){
		try {
			return historyService.getcompany(data);
		}catch(Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	// 이력 삭제하기
	@RequestMapping(value="/history/remove",method=RequestMethod.POST)
	@ResponseBody
	public void removeHistory(HttpServletRequest request, @RequestBody LinkedHashMap<String, Object> data ){
		historyService.remove(data);
	}
	
	// 이력 수정하기
	@RequestMapping(value="/history/update",method=RequestMethod.POST)
	@ResponseBody
	public void update(HttpServletRequest request, @RequestBody LinkedHashMap<String, Object> data){
		historyService.update(data);
	}
	
	
	@RequestMapping(value="/history/insert",method=RequestMethod.POST)
	@ResponseBody
	public void insert(HttpServletRequest request, @RequestBody LinkedHashMap<String, Object> data){
		historyService.insert(data);
	}
	
	
	
	
	//프로젝트 리스트 가져오기
	@RequestMapping(value="/history/getprojectlist",method=RequestMethod.POST)
	@ResponseBody
	public List<Map<String,Object>> getProjectList(HttpServletRequest request, @RequestBody Map<String, Object> data ){
		return historyService.getProjectList(data);
	}
	
}

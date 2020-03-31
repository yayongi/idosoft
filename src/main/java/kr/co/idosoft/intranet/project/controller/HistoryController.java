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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import kr.co.idosoft.intranet.login.vo.SessionVO;
import kr.co.idosoft.intranet.member.model.service.MemberServiceImpl;
import kr.co.idosoft.intranet.project.model.service.HistoryServiceImpl;

@Controller
public class HistoryController {
	
private static final Logger LOG = LoggerFactory.getLogger(HistoryController.class);
	
	@Resource HistoryServiceImpl historyService;
	@Resource MemberServiceImpl memberService;		//멤버정보
	
	@RequestMapping(value="/allHistory",method=RequestMethod.POST)
	@ResponseBody
	public ModelAndView allHistory(HttpServletRequest request, @RequestBody Map<String, Object> params ){
		
		if(LOG.isDebugEnabled()) {
			LOG.debug("/resister.exp");
		}
		
		HttpSession session = request.getSession();
		SessionVO sessionVo = (SessionVO) session.getAttribute("SESSION_DATA");	// 세션 정보
		String managerYN = sessionVo.getMANAGER_YN();
		String member_no = sessionVo.getMEMBER_NO();
		
		ModelAndView mv = new ModelAndView();
		
		// ModelAndView 초기값 셋팅
		mv.setViewName("jsonView");
		mv.addObject("isError", "false");				// 에러를 발생시켜야할 경우,
		mv.addObject("isNoN", "false");					// 목록이 비어있는 경우,
		
		
		ArrayList<Map<String, Object>> history_list = new ArrayList<Map<String, Object>>();
		ArrayList<Object> member_list = new ArrayList<Object>();
		try {
			history_list = (ArrayList<Map<String, Object>>)historyService.selectList();
			if(!"N".equals(managerYN)) {
				member_list = (ArrayList<Object>)memberService.selectMemberList();
			}else {
				member_list.add(memberService.selectMember(member_no));
			}
			
		} catch (Exception e) {
			LOG.debug("JSON OBJECT 변환 실패 : " + e.getMessage());
		}
		
		
		mv.addObject("history_list", history_list);
		mv.addObject("member_list", member_list);
		return mv;
	}

}

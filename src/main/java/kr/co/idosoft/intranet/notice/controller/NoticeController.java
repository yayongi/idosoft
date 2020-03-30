package kr.co.idosoft.intranet.notice.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.idosoft.common.util.commonUtil;
import kr.co.idosoft.intranet.login.vo.SessionVO;
import kr.co.idosoft.intranet.notice.service.NoticeServiceImpl;
import kr.co.idosoft.intranet.notice.vo.NoticeVO;

@RestController
@RequestMapping("/notice")
public class NoticeController {
	
	private static final Logger logger = LoggerFactory.getLogger(NoticeController.class);
	
	@Autowired
	private NoticeServiceImpl noticeService;
	
	//등록
	@PostMapping("/register")
	public boolean registNotice(@RequestBody NoticeVO noticeVO, HttpServletRequest request) {
		
		String path = request.getSession().getServletContext().getRealPath("/")+"resources";
		
		SessionVO sessionVO= (SessionVO) request.getSession().getAttribute("SESSION_DATA");
		
		noticeVO.setReg_id(sessionVO.getMEMBER_NO());
		
		logger.debug("###########################################################");
		logger.debug("게시글 번호 : "+noticeVO.getBoard_no());
		logger.debug("게시글 제목 : "+noticeVO.getTitle());
		logger.debug("게시글 내용 : "+noticeVO.getContent());
		logger.debug("게시글 중요여부 : "+noticeVO.getMajor_yn());
		logger.debug("게시글 중요기간 : "+noticeVO.getMajor_period_date());
		logger.debug("###########################################################");
		
		try {
			noticeService.inputNotice(noticeVO);
		}catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}
	//수정
	@PostMapping("/modify")
	public boolean modifyNotice(Model model, @RequestBody NoticeVO noticeVO, HttpServletRequest request) {
		SessionVO sessionVo = (SessionVO) request.getSession().getAttribute("SESSION_DATA");
		String mNo = sessionVo.getMEMBER_NO();						// 회원번호
		NoticeVO regedNotice = noticeService.findNotice(noticeVO.getBoard_no());
		
		//작성자만 수정가능
		if(!mNo.equals(regedNotice.getReg_id())) return false;
		
		noticeVO.setUpd_id(mNo);
		try {
			if(0 < noticeService.modifyNotice(noticeVO)) {
				return true;
			}else {
				return false;
			}
		}catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	//단일 삭제
	@PostMapping("/delete")
	public boolean deleteNotice(@RequestBody NoticeVO noticeVO, HttpServletRequest request) {
		
		boolean isAdmin = commonUtil.isAdmin(request.getSession());
		
		SessionVO sessionVo = (SessionVO) request.getSession().getAttribute("SESSION_DATA");
		String mNo = sessionVo.getMEMBER_NO();						// 회원번호
		NoticeVO regedNotice = noticeService.findNotice(noticeVO.getBoard_no());
		
		//작성자 또는 관리자 삭제가능
		if(!mNo.equals(regedNotice.getReg_id()) || !isAdmin) return false;
		
		try {
			if(0 < noticeService.deleteNotice(noticeVO.getBoard_no())) {
				return true;
			}else {
				return false;
			}
		}catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	//선택 삭제
	@PostMapping("/deletelist")
	public boolean  deleteNoticeeList(@RequestBody Map<String, List<Integer>> notice_no_list, HttpServletRequest request) {
		
		boolean isAdmin = commonUtil.isAdmin(request.getSession());
		if(!isAdmin) return false;
		
		List<Integer> selectedNoticeNo = (List<Integer>) notice_no_list.get("board_no");
		
		try {
			noticeService.deleteNoticeList(selectedNoticeNo);
		}catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}
	//	리스트
	@PostMapping("/findlist")
	public Map<String, Object> findNoticeList(HttpServletRequest request, @RequestBody Map<String, Object> data) {
		boolean isAdmin = commonUtil.isAdmin(request.getSession());
		
		Map<String, Object> searchData = (Map<String, Object>) data.get("state");
		
		logger.debug("#########################################################");
		logger.debug("searchData ? "+searchData.toString());
		logger.debug("#########################################################");
		
		if(searchData.get("stDt") != null){
			searchData.put("stDt", searchData.get("stDt")+"01");
		}
		if(searchData.get("edDt") != null){
			int lastDate = (Integer) commonUtil.LastDateInMonth(String.valueOf(searchData.get("edDt")));
			searchData.put("edDt", searchData.get("edDt")+String.valueOf(lastDate));
		}
		data.put("searchData", searchData);
		
		
		Map<String, Object> resultData = new HashMap<>();
		
		int count = noticeService.getListCount(searchData);
		resultData.put("count", count);
		resultData.put("isAdmin", isAdmin);
		//카운트가 0일경우 리스트는 반환하지 않음
		if(count == 0) {
			return resultData;
		}
		
		resultData.put("noticeData", noticeService.findNoticeList(data));
		
		return resultData;
		
	}
	//단일 조회
	@PostMapping("/find")
	public NoticeVO findNoticeInfo(@RequestBody NoticeVO noticeVO) {
		return noticeService.findNotice(noticeVO.getBoard_no());
	}
	
	//대쉬보드용 리스트
	@PostMapping("/dashboardList")
	public List<NoticeVO> selectListDashboard() {
		return noticeService.selectListDashboard();
	}
		
}

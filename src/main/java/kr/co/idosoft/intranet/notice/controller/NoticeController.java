package kr.co.idosoft.intranet.notice.controller;

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
			
			SessionVO sessionVO= (SessionVO) request.getSession().getAttribute("SESSION_DATA");
			noticeVO.setUpd_id(sessionVO.getMEMBER_NO());
			
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
//			boolean isAdmin = (String) request.getSession().getAttribute("IS_ADMIN") == "1" ? true : false;
			
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
			
			List<Integer> selectedNoticeNo = (List<Integer>) notice_no_list.get("board_no");
			
			try {
				noticeService.deleteNoticeList(selectedNoticeNo);
			}catch (Exception e) {
				e.printStackTrace();
				return false;
			}
			return true;
		}
		//리스트
//		@PostMapping("/findlist")
//		public Map<String, Object> findNoticeList(Model model, HttpServletRequest request) {
//			boolean isAdmin = "1".equals( (String)request.getSession().getAttribute("IS_ADMIN") )? true : false;
//			Map<String, Object> data = new HashMap<>();
//			data.put("resData", noticeService.findNoticeList());
//			data.put("isAdmin", isAdmin);
//			
//			logger.debug("#########################################################");
//			logger.debug("ISADMIN ? "+request.getSession().getAttribute("IS_ADMIN"));
//			logger.debug("#########################################################");
//			
////			return resService.findResourceList();
//			return data;
//		}
		//단일 조회
		@PostMapping("/find")
		public NoticeVO findNoticeInfo(@RequestBody NoticeVO noticeVO) {
			return noticeService.findNotice(noticeVO.getBoard_no());
		}
}

package kr.co.idosoft.intranet.notice.service;

import java.util.List;


import java.util.Map;

import org.springframework.stereotype.Service;

import kr.co.idosoft.intranet.notice.vo.NoticeVO;
/**
 * 
 * @author 김준선
 * @since 2020.03.25
 * @content NoticeDao Service 
 */
@Service
public interface NoticeService {
	/**
	 * 공지사항 등록
	 */
	void inputNotice(NoticeVO noticeVO);
	/**
	 * 공지사항 수정
	 * @return int
	 */
	int modifyNotice(NoticeVO noticeVO);
	/**
	 * 공지사항 삭제
	 * @return int
	 */
	int deleteNotice(int board_no);
	/**
	 * 공지사항 선택 삭제
	 */
	void deleteNoticeList(Map<String, List<Integer>> selectedNoticeNo);
	/**
	 * 공지사항번호로 공지사항 조회
	 * @return NoticeVO
	 */
	NoticeVO findNotice(int board_no);
	/**
	 * 대쉬보드용 리스트 가져오기
	 * @return List<NoticeVO>
	 */
	List<NoticeVO> selectListDashboard();
	/**
	 * 검색조건으로 공지사항리스트 조회
	 * @return List<NoticeVO>
	 */
	List<NoticeVO> findNoticeList(Map<String, Object> data);
	/**
	 * 검색조건으로 공지사항 카운트
	 * @return int
	 */
	int getListCount(Map<String, Object> searchData);

}

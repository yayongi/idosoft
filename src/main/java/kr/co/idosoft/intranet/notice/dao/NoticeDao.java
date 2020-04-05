package kr.co.idosoft.intranet.notice.dao;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import kr.co.idosoft.intranet.notice.vo.NoticeVO;

/**
 * 
 * @author 김준선
 * @since 2020.03.25
 * @content Notice DAO
 */
@Repository
public interface NoticeDao {
	/**
	 * 공지사항 등록
	 */
	void insert(NoticeVO noticeVO);
	/**
	 * 공지사항 수정
	 * @return int
	 */
	int update(NoticeVO noticeVO);
	/**
	 * 공지사항 삭제
	 * @return int
	 */
	int delete(int board_no);
	/**
	 * 공지사항번호로 공지사항 가져오기
	 * @return NoticeVO
	 */
	NoticeVO select(int board_no);
	/**
	 * 검색조건으로 공지사항리스트 가져오기
	 * @return List<NoticeVO>
	 */
	List<NoticeVO> selectList(Map<String,Object> data);
	/**
	 * 대쉬보드용 리스트 가져오기
	 * @return List<NoticeVO>
	 */
	List<NoticeVO> selectListDashboard();
	/**
	 * 검색조건으로 공지사항 카운트
	 * @return int
	 */
	int count(Map<String, Object> data);
	/**
	 * 공지사항 선택 삭제
	 */
	void deleteList(Map<String, List<Integer>> selectedNoticeNo);
}

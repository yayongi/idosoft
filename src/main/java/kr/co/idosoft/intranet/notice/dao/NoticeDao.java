package kr.co.idosoft.intranet.notice.dao;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import kr.co.idosoft.intranet.notice.vo.NoticeVO;

@Repository
public interface NoticeDao {

	void insert(NoticeVO noticeVO);

	int update(NoticeVO noticeVO);

	int delete(int board_no);

	NoticeVO select(int board_no);

	List<NoticeVO> selectList(Map<String,Object> data);
	// 대쉬보드용 리스트
	List<NoticeVO> selectListDashboard();

	int count(Map<String, Object> data);

}

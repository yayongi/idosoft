package kr.co.idosoft.intranet.notice.service;

import java.util.List;

import org.springframework.stereotype.Repository;

import kr.co.idosoft.intranet.notice.vo.NoticeVO;
@Repository
public interface NoticeService {

	void inputNotice(NoticeVO noticeVO);

	int modifyNotice(NoticeVO noticeVO);

	int deleteNotice(int board_no);

	void deleteNoticeList(List<Integer> selectedNoticeNo);

	NoticeVO findNotice(int board_no);
	
	//대쉬보드용 리스트
	List<NoticeVO> selectListDashboard();

}

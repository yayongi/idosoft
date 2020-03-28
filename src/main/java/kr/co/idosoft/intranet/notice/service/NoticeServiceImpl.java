package kr.co.idosoft.intranet.notice.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.idosoft.intranet.notice.dao.NoticeDao;
import kr.co.idosoft.intranet.notice.vo.NoticeVO;

@Service
public class NoticeServiceImpl implements NoticeService{
	
	@Autowired
	private NoticeDao noticeDao;
	
	private static final Logger logger = LoggerFactory.getLogger(NoticeServiceImpl.class);
	
	//공지등록
	@Override
	public void inputNotice(NoticeVO noticeVO) {
		Date date = new Date();
		SimpleDateFormat dateTime = new SimpleDateFormat("y-MM-dd hh:mm:ss");
		noticeVO.setReg_datetime(dateTime.format(date));
		
		noticeDao.insert(noticeVO);
	}
	//공지수정
	@Override
	public int modifyNotice(NoticeVO noticeVO) {
		Date date = new Date();
		SimpleDateFormat dateTime = new SimpleDateFormat("y-MM-dd hh:mm:ss");
		noticeVO.setUpd_datetime(dateTime.format(date));
		
		return noticeDao.update(noticeVO);
	}
	//공지삭제
	@Override
	public int deleteNotice(int board_no) {
		return noticeDao.delete(board_no);
	}
	//공지선택 삭제
	@Override
	@Transactional
	public void deleteNoticeList(List<Integer> selectedNoticeNo) {
		for(int i : selectedNoticeNo) {
			noticeDao.delete(i);
		}
	}
	//공지 조회
	@Override
	public NoticeVO findNotice(int board_no) {
		return noticeDao.select(board_no);
	}
	//공지 리스트 조회
	@Override
	public List<NoticeVO> findNoticeList(){
		return noticeDao.selectList();
	}
	
	// 대쉬보드용 리스트
	@Override
	public List<NoticeVO> selectListDashboard() {
		return noticeDao.selectListDashboard();
	}
}

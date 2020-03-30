package kr.co.idosoft.intranet.notice.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.idosoft.common.util.StringUtils;
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
	public List<NoticeVO> findNoticeList(Map<String, Object> data){
		Map<String, Object> searchData = (Map<String, Object>) data.get("state");
		
		Map<String,Object> newMap =new HashMap<String,Object>();
		for(String str : searchData.keySet()) {
			if("search".equals(str)) {
				List<String> searchList = StringUtils.arStrRegexMultiSpace(StringUtils.StringReplace((String) searchData.get(str)));
				if("".equals(searchList.get(0))) newMap.put("searchList", null);
				else newMap.put("searchList", searchList);
			}else {
				newMap.put(str, String.valueOf(searchData.get(str)));
			}
		}
		newMap.put("offset", (Integer)data.get("page")*(Integer)data.get("rowsPerPage"));
		newMap.put("limit", (Integer)data.get("rowsPerPage"));
		
		return noticeDao.selectList(newMap);
	}
	//공지 리스트 카운트
	@Override
	public int getListCount(Map<String, Object> searchData) {
		Map<String,Object> newMap =new HashMap<String,Object>();
		for(String str : searchData.keySet()) {
			if("search".equals(str)) {
				List<String> searchList = StringUtils.arStrRegexMultiSpace(StringUtils.StringReplace((String) searchData.get(str)));
				
				if("".equals(searchList.get(0))) newMap.put("searchList", null);
				else newMap.put("searchList", searchList);
			}else {
				newMap.put(str, String.valueOf(searchData.get(str)));
			}
		}
		
		return noticeDao.count(newMap);
	}
	
	// 대쉬보드용 리스트
	@Override
	public List<NoticeVO> selectListDashboard() {
		return noticeDao.selectListDashboard();
	}
}

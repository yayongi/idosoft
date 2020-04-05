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

/**
 * 
 * @author 김준선
 * @since 2020.03.25
 * @content NoticeDao Service implements
 */
@Service
public class NoticeServiceImpl implements NoticeService{
	
	@Autowired
	private NoticeDao noticeDao;
	
	private static final Logger logger = LoggerFactory.getLogger(NoticeServiceImpl.class);
	
	/**
	 * 공지사항 등록
	 */
	@Override
	public void inputNotice(NoticeVO noticeVO) {
		Date date = new Date();
		SimpleDateFormat dateTime = new SimpleDateFormat("y-MM-dd hh:mm:ss");
		noticeVO.setReg_datetime(dateTime.format(date));
		
		noticeDao.insert(noticeVO);
	}
	/**
	 * 공지사항 수정
	 * @return int
	 */
	@Override
	public int modifyNotice(NoticeVO noticeVO) {
		Date date = new Date();
		SimpleDateFormat dateTime = new SimpleDateFormat("y-MM-dd hh:mm:ss");
		noticeVO.setUpd_datetime(dateTime.format(date));
		
		return noticeDao.update(noticeVO);
	}
	/**
	 * 공지사항 삭제
	 * @return int
	 */
	@Override
	public int deleteNotice(int board_no) {
		return noticeDao.delete(board_no);
	}
	/**
	 * 공지사항 선택 삭제
	 */
	@Override
	@Transactional
	public void deleteNoticeList(Map<String, List<Integer>> selectedNoticeNo) {
		noticeDao.deleteList(selectedNoticeNo);
	}
	/**
	 * 공지사항번호로 공지사항 조회
	 * @return NoticeVO
	 */
	@Override
	public NoticeVO findNotice(int board_no) {
		return noticeDao.select(board_no);
	}
	/**
	 * 검색조건으로 공지사항리스트 조회
	 * @return List<NoticeVO>
	 */
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
	/**
	 * 검색조건으로 공지사항 카운트
	 * @return int
	 */
	@Override
	public int getListCount(Map<String, Object> searchData) {
		Map<String,Object> newMap =new HashMap<String,Object>();
		for(String str : searchData.keySet()) {
			if("search".equals(str)) {
				List<String> searchList = StringUtils.arStrRegexMultiSpace(StringUtils.StringReplace((String) searchData.get(str)));
				logger.debug("############################################################");
				logger.debug("검색어 : "+searchList.toString());
				logger.debug("############################################################");
				//검색어가 존재하고 검색어를 정규화, 공백으로 나눈 리스트 사이즈가 0이면 0반환
				if( ((String) searchData.get(str)).length() != 0 && searchList.size() == 0) return 0;
					
				if("".equals(searchList.get(0))) newMap.put("searchList", null);
				else newMap.put("searchList", searchList);
			}else {
				newMap.put(str, String.valueOf(searchData.get(str)));
			}
		}
		
		return noticeDao.count(newMap);
	}
	
	/**
	 * 대쉬보드용 리스트 가져오기
	 * @return List<NoticeVO>
	 */
	@Override
	public List<NoticeVO> selectListDashboard() {
		return noticeDao.selectListDashboard();
	}
}

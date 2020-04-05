package kr.co.idosoft.intranet.notice.dao;

import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import kr.co.idosoft.intranet.notice.vo.NoticeVO;

/**
 * 
 * @author 김준선
 * @since 2020.03.25
 * @content NoticeDao DAO implements
 */
@Repository("NoticeDao")
public class NoticeDaoImpl implements NoticeDao{
	
	@Autowired
	private SqlSessionTemplate sqlTemplate;
	
	private static final Logger logger = LoggerFactory.getLogger(NoticeDaoImpl.class);
	/**
	 * 공지사항 등록
	 */
	@Override
	public void insert(NoticeVO noticeVO) {
		sqlTemplate.insert("notice.insert", noticeVO);
	}
	/**
	 * 공지사항 수정
	 * @return int
	 */
	@Override
	public int update(NoticeVO noticeVO) {
		return sqlTemplate.update("notice.update", noticeVO);
	}
	/**
	 * 공지사항 삭제
	 * @return int
	 */
	@Override
	public int delete(int board_no) {
		return sqlTemplate.delete("notice.deleteInfo", board_no);
	}
	/**
	 * 공지사항 선택 삭제
	 */
	@Override
	public void deleteList(Map<String, List<Integer>> selectedNoticeNo) {
		sqlTemplate.delete("notice.deleteList", selectedNoticeNo);
	}
	/**
	 * 공지사항번호로 공지사항 조회
	 * @return NoticeVO
	 */
	@Override
	public NoticeVO select(int board_no) {
		// TODO Auto-generated method stub
		return sqlTemplate.selectOne("notice.selectInfo", board_no);
	}
	/**
	 * 검색조건으로 공지사항리스트 조회
	 * @return List<NoticeVO>
	 */
	@Override
	public List<NoticeVO> selectList(Map<String,Object> data) {
		List<NoticeVO> list = sqlTemplate.selectList("notice.selectList", data);
		return list;
	}
	/**
	 * 검색조건으로 공지사항 카운트
	 * @return int
	 */
	@Override
	public int count(Map<String,Object> data) {
		int count = sqlTemplate.selectOne("notice.count", data);
		return count;
	}
	/**
	 * 대쉬보드용 리스트 가져오기
	 * @return List<NoticeVO>
	 */
	@Override
	public List<NoticeVO> selectListDashboard() {
		return sqlTemplate.selectList("selectListDashboard");
	}
}

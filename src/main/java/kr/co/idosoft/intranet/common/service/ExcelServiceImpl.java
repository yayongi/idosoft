package kr.co.idosoft.intranet.common.service;

import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * 
 * @author 유기환
 * @since 2020.03.16
 * @content ExcelService
 */

@Service
public class ExcelServiceImpl implements ExcelService {

	private static final Logger LOG = LoggerFactory.getLogger(ExcelServiceImpl.class);
	/**
	 *  엑셀 워크북 객체로 생성 
	 * @param list
	 * @return SXSSFWorkbook
	 */
	@Override
	public SXSSFWorkbook commonExcelWorkbook(String title, List<Map<String,Object>> list) {
		SXSSFWorkbook workbook = new SXSSFWorkbook();

		// 시트 생성
		SXSSFSheet sheet = workbook.createSheet(title);

		Map<String, Object> headItem = list.get(0);

		// 열너비 설정
		//sheet.setColumnWidth(0, 5000); 

		Row headerRow = sheet.createRow(0);
		Cell headerCell = null;
		
		int row = 0;
		int col = 0;
		
		LOG.debug("###################################################################");
		for(Map.Entry<String, Object> subItem: headItem.entrySet()){
			
			// 해당 행의 첫번째 열 셀 생성
			LOG.debug("# subItem : " + subItem.getKey());
			// 키값으로 header
			
			headerCell = headerRow.createCell(col);
			headerCell.setCellValue(String.valueOf(subItem.getKey()));
			
			col++;
		}
		LOG.debug("###################################################################");
		
		// 내용 행 및 셀 생성
		Row bodyRow = null;
		Cell bodyCell = null;

		col = 0;

		for(Map<String, Object> bodyItem : list){
			// 행 생성
			col = 0;

			bodyRow = sheet.createRow(row+1);

			LOG.debug(" ROW : " + bodyRow.getRowNum());

			for(Map.Entry<String, Object> subItem: bodyItem.entrySet()){
				bodyCell = bodyRow.createCell(col);

				LOG.debug("# subItem Value("+col+") : " + subItem.getValue());
				// 데이터 번호 표시
				bodyCell.setCellValue(String.valueOf(subItem.getValue()));

				col++;
			}
			row++;
		}
		LOG.debug("###################################################################");

		return workbook;
	}
}

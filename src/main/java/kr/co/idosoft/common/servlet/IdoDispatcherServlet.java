package kr.co.idosoft.common.servlet;

import java.util.Locale;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.DispatcherServlet;
import org.springframework.web.servlet.View;

import kr.co.idosoft.common.util.ParamUtils;


public class IdoDispatcherServlet extends DispatcherServlet{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 5768643344009467880L;
	private static final Logger log = LoggerFactory.getLogger(IdoDispatcherServlet.class);
	
	protected void doService(HttpServletRequest request, HttpServletResponse response)throws Exception{
		request.setCharacterEncoding("UTF-8");
		log.info("[IdoServletDispatcher] Start ");
//		request.get
		log.info(ParamUtils.printHeader(request));
		if(request.getContentType() != null && request.getContentType().toLowerCase().indexOf("multipart/form-data") > -1){
			log.info(">>>>>>>>>>>>>>>>>> MULTIPART <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
		}else{
			log.info(ParamUtils.printParameter(request));
		}
		super.doService(request, response);
		log.info("[IdoServletDispatcher] End ");
	}
	
	@Override
	protected View resolveViewName(String viewName, Map<String, Object> model,
			Locale locale, HttpServletRequest request) throws Exception {
		// TODO Auto-generated method stub
		StringBuffer sb = new StringBuffer();
		
		sb.append("\n######################################## VIEW INFO START ########################################\n");
		sb.append("* VIEW NAME[").append(viewName).append("]\n");
		sb.append("* DATA : ").append(model.toString()).append("\n");
		sb.append("######################################## VIEW INFO END ########################################\n");
		log.info(sb.toString());
		return super.resolveViewName(viewName, model, locale, request);
	}
}

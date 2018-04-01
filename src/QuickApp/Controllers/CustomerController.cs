namespace PskOnline.Service.Controllers
{
  using System;
  using System.Collections.Generic;
  using System.Threading.Tasks;
  using Microsoft.AspNetCore.Mvc;
  using Microsoft.Extensions.Logging;

  using AutoMapper;
  using DAL;
  using PskOnline.Service.ViewModels;
  using PskOnline.Service.Helpers;

  [Route("api/[controller]")]
  public class CustomerController : Controller
  {
    private IUnitOfWork _unitOfWork;
    readonly ILogger _logger;
    readonly IEmailer _emailer;

    public CustomerController(IUnitOfWork unitOfWork, ILogger<CustomerController> logger, IEmailer emailer)
    {
      _unitOfWork = unitOfWork;
      _logger = logger;
      _emailer = emailer;
    }

    // GET: api/values
    [HttpGet]
    public IActionResult Get()
    {
      var allCustomers = _unitOfWork.Customers.GetAllCustomersData();
      return Ok(Mapper.Map<IEnumerable<CustomerViewModel>>(allCustomers));
    }

    [HttpGet("throw")]
    public IEnumerable<CustomerViewModel> Throw()
    {
      throw new InvalidOperationException("This is a test exception: " + DateTime.Now);
    }

    [HttpGet("email")]
    public async Task<string> Email()
    {
      string recepientName = "Psk-Online Tester"; //         <===== Put the recepient's name here
      string recepientEmail = "alexei.adadurov@mail.ru"; //   <===== Put the recepient's email here

      string message = EmailTemplates.GetTestEmail(recepientName, DateTime.UtcNow);

      (bool success, string errorMsg) response = 
        await _emailer.SendEmailAsync(recepientName, recepientEmail, "Test Email from PskOnline", message);

      if (response.success)
      {
        return "Success";
      }

      return "Error: " + response.errorMsg;
    }

    // GET api/values/5
    [HttpGet("{id}")]
    public string Get(int id)
    {
      return "value: " + id;
    }

    // POST api/values
    [HttpPost]
    public void Post([FromBody]string value)
    {
    }

    // PUT api/values/5
    [HttpPut("{id}")]
    public void Put(int id, [FromBody]string value)
    {
    }

    // DELETE api/values/5
    [HttpDelete("{id}")]
    public void Delete(int id)
    {
    }
  }
}

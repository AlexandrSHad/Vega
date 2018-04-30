using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using vega.Controllers.Resources;
using vega.Models;

namespace vega.Controllers
{
    [Route("/api/vehicles")]
    public class VehiclesController : Controller
    {
        private readonly IMapper _mapper;

        public VehiclesController(IMapper mapper)
        {
            this._mapper = mapper;
        }

        [HttpPost()]
        public IActionResult CreateVehicle([FromBody] VehicleResource vehicleResource)
        {
            var vehicle = _mapper.Map<VehicleResource, Vehicle>(vehicleResource);
            return Ok(vehicle);
        }
    }
}

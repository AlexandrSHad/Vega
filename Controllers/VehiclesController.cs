using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using vega.Controllers.Resources;
using vega.Models;
using vega.Persistence;

namespace vega.Controllers
{
    [Route("/api/vehicles")]
    public class VehiclesController : Controller
    {
        private readonly IMapper _mapper;
        private readonly VegaDbContext _context;

        public VehiclesController(VegaDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpPost()]
        public async Task<IActionResult> CreateVehicle([FromBody] VehicleResource vehicleResource)
        {
            // only for input validation
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // // Model Id validation is required if we have to build an public API,
            // // but in this case it is an extra noise, because our Angular client
            // // should not send icorrect Id.
            // // The same is about Id's for each feature.
            // var model = await _context.Models.FindAsync(vehicleResource.ModelId);
            //
            // if (model == null)
            // {
            //     ModelState.AddModelError("ModelId", "Invalid model Id.");
            //     return BadRequest(ModelState);
            // }

            // // for business logic validation
            // if (<condition>)
            //     ModelState.AddModelError("", "<error>");

            var vehicle = _mapper.Map<VehicleResource, Vehicle>(vehicleResource);
            vehicle.LastUpdate = DateTime.Now;

            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();

            var result = _mapper.Map<Vehicle, VehicleResource>(vehicle);

            return Ok(result);
        }
    }
}

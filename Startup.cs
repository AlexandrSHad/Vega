using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using vega.Core;
using vega.Persistence;

namespace vega
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // debug server side rendering
            // To debug
            //   * Uncomment three line bellow
            //   * Open chrome://inspect in a Chromium-based browser. Click the Configure button and ensure your target host and port are listed.
            // services.AddNodeServices(options => {
            //     options.LaunchWithDebugging = true;
            //     options.DebuggingPort = 9229;
            // });
            // debug
            
            services.AddAutoMapper();
            
            services.AddDbContext<VegaDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("Default"))
            );

            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IVehicleRepository, VehicleRepository>();

            services.AddMvc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "Index" });
            });
        }
    }
}

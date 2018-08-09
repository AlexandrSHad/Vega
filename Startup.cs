using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using vega.Controllers;
using vega.Core;
using vega.Core.Models;
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
            
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

            }).AddJwtBearer(options =>
            {
                options.Authority = "https://shad-vega.eu.auth0.com/";
                options.Audience = "https://api.shad.vega.com";
            });

            services.AddAuthorization(opt => {
                opt.AddPolicy(Policies.RequireAdminRole, policy =>
                    policy.RequireClaim("https://api.shad.vega.com/roles", "Admin"));
            });

            services.Configure<PhotoSettings>(Configuration.GetSection("PhotoSettings"));

            services.AddAutoMapper(cfg => {
                // disable inline mapping, only maps that was explicitly created can works
                // more info: http://docs.automapper.org/en/stable/Inline-Mapping.html?highlight=CreateMissingTypeMaps
                cfg.CreateMissingTypeMaps = false;
            });
            
            services.AddDbContext<VegaDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("Default"))
            );

            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IVehicleRepository, VehicleRepository>();
            services.AddScoped<IPhotoRepository, PhotoRepository>();

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

            app.UseAuthentication();

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

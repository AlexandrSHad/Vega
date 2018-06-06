using System.Threading.Tasks;
using vega.Core;

namespace vega.Persistence
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly VegaDbContext _context;

        public UnitOfWork(VegaDbContext context)
        {
          _context = context;
        }

        public async Task CompliteAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}

using System.Threading.Tasks;

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

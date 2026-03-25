export const Footer = () => {
  return (
    <footer className="border-t bg-muted/40 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold">Explore</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Yoga</li>
              <li>HIIT</li>
              <li>Pilates</li>
              <li>Boxing</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Neighborhoods</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Palermo</li>
              <li>Recoleta</li>
              <li>San Telmo</li>
              <li>Belgrano</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">For Studios</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>List Your Studio</li>
              <li>Studio Dashboard</li>
              <li>Pricing</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Support</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ClassesBA. All rights reserved. Buenos Aires, Argentina.</p>
        </div>
      </div>
    </footer>
  );
};

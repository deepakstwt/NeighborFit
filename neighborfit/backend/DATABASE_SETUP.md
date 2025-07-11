# Database Setup Guide

## 🎯 Production Use (Recommended)

### For Real Application
```bash
npm run production-seed
```
**What it does:**
- ✅ Adds 19 authentic Indian neighborhoods
- ❌ Does NOT add any test users
- 👥 Users will be created only when they actually sign up
- 🔒 Safe for production environment

---

## 🧪 Development/Testing Scripts

### Reset Everything
```bash
npm run reset-db
```
**What it does:**
- 🗑️ Clears all users and neighborhoods
- 🔄 Gives you a clean slate

### Add Only Neighborhoods
```bash
npm run seed
# OR
npm run seed-neighborhoods
```
**What it does:**
- 🏘️ Adds neighborhoods only
- 👥 No test users

### Add Test Users (Development Only)
```bash
npm run seed-users
```
**What it does:**
- 👥 Adds 10 fake/test users
- ⚠️ Only for development/testing
- 🚫 Don't use in production

---

## 🚨 Important Notes

### Current Database Status
- **Neighborhoods:** 19 authentic Indian neighborhoods ✅
- **Users:** 0 (clean - only real signups) ✅

### Why No Test Users?
- Test users confuse real users
- They appear in your database without anyone signing up
- Production apps should only have real users
- Test users are only for development/testing

### If You See Unwanted Users
1. They came from running `npm run seed-users`
2. Run `npm run reset-db` to clear everything
3. Run `npm run production-seed` to add only neighborhoods
4. Now only real signups will create users

---

## 📋 Quick Commands

| Command | Use Case | Adds Neighborhoods | Adds Users |
|---------|----------|-------------------|------------|
| `npm run production-seed` | **Production** | ✅ | ❌ |
| `npm run reset-db` | Clean slate | ❌ | ❌ |
| `npm run seed` | Dev - neighborhoods only | ✅ | ❌ |
| `npm run seed-users` | Dev - testing only | ❌ | ✅ (fake) |

**Recommendation:** Always use `npm run production-seed` for your live app! 
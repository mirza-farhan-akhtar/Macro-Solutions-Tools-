# Department Workspace System - Testing Guide

## Pre-Testing Setup

### Requirements
- ✅ Frontend running on port 3002
- ✅ Backend running on port 8000
- ✅ Authentication token stored in localStorage
- ✅ At least one department created in the system
- ✅ Chrome/Firefox/Edge browser

### How to Start Testing
1. Navigate to Admin Dashboard
2. Locate "Workspace" section in sidebar (should appear automatically if departments exist)
3. Click on any department to start testing

---

## Test Suite 1: Navigation & Menu System

### Test 1.1: Workspace Menu Visibility ✓
**Expected**: Workspace section appears in sidebar when departments exist
- [ ] Navigate to admin dashboard
- [ ] Check sidebar for "Workspace" section
- [ ] Verify workspace appears only if departments exist
- [ ] **Pass Criteria**: Workspace section visible with department names

### Test 1.2: Department List Display ✓
**Expected**: All departments list in workspace menu
- [ ] Click on "Workspace" section
- [ ] Verify all created departments appear
- [ ] Check department names are correct
- [ ] **Pass Criteria**: All departments listed with Building2 icon

### Test 1.3: Dropdown Toggle ✓
**Expected**: Each department can expand/collapse submenu
- [ ] Click on a department to toggle
- [ ] Verify submenu appears with 7 feature options
- [ ] Click again to collapse
- [ ] **Pass Criteria**: Smooth expand/collapse animation with chevron rotation

### Test 1.4: Submenu Navigation ✓
**Expected**: All 7 tabs navigate correctly
- [ ] Click "Overview" - should load /admin/hr/departments/:id
- [ ] Click "Members" - should load /admin/hr/departments/:id/members
- [ ] Click "Budget" - should load /admin/hr/departments/:id/budget
- [ ] Click "Settings" - should load /admin/hr/departments/:id/settings
- [ ] Click "Project Requests" - should load /admin/hr/departments/:id/project-requests
- [ ] Click "Analytics" - should load /admin/hr/departments/:id/analytics
- [ ] Click "Timeline" - should load /admin/hr/departments/:id/timeline
- [ ] **Pass Criteria**: All routes load without errors, URL shows correct path

---

## Test Suite 2: Overview Tab

### Test 2.1: Department Data Loading ✓
**Expected**: Department info loads from API
- [ ] Select a department and go to Overview
- [ ] Wait for loading spinner to finish
- [ ] Verify department name displays
- [ ] Check employee count shows
- [ ] **Pass Criteria**: Data loads within 2-3 seconds, no errors in console

### Test 2.2: Back Navigation ✓
**Expected**: Back button returns to previous page
- [ ] Click back button on Overview page
- [ ] Should return to admin dashboard or previous page
- [ ] **Pass Criteria**: Navigation works correctly

### Test 2.3: Employee List Display ✓
**Expected**: Shows all employees with details
- [ ] Scroll to employee section
- [ ] Verify employees list appears
- [ ] Check employee names display
- [ ] Verify contact info (email, phone) visible
- [ ] **Pass Criteria**: Employee cards show correctly with all info

### Test 2.4: Error Handling ✓
**Expected**: Shows error message if department not found
- [ ] Try accessing invalid department ID manually
- [ ] Should show error message
- [ ] UI should not crash
- [ ] **Pass Criteria**: Graceful error display

---

## Test Suite 3: Members Tab

### Test 3.1: Member List Rendering ✓
**Expected**: Displays all members in employee grid
- [ ] Go to Members tab
- [ ] Wait for data to load
- [ ] Verify member cards display
- [ ] Check each card shows member details
- [ ] **Pass Criteria**: All members visible in formatted cards

### Test 3.2: Member Information ✓
**Expected**: Shows complete member profile info
- [ ] Verify each card shows:
  - [ ] Member name/title
  - [ ] Email address (clickable)
  - [ ] Phone number
  - [ ] Avatar with initials
- [ ] **Pass Criteria**: All fields populated correctly

### Test 3.3: Remove Member Functionality ✓
**Expected**: Can remove members from department
- [ ] Click remove button on a member card
- [ ] Verify confirmation appears (optional)
- [ ] Member should be removed from list
- [ ] Toast notification should show success
- [ ] **Pass Criteria**: Member removed and UI updates

### Test 3.4: Add Member Button ✓
**Expected**: New Member button present and clickable
- [ ] Locate "New Member" button at top
- [ ] Click button
- [ ] Modal/form should appear (if implemented)
- [ ] **Pass Criteria**: Button functional, navigation works

---

## Test Suite 4: Budget Tab

### Test 4.1: Budget Overview Cards ✓
**Expected**: Shows budget summary
- [ ] Go to Budget tab
- [ ] Verify three main cards display:
  - [ ] Allocated budget ($500K)
  - [ ] Current spending ($390K)
  - [ ] Remaining amount ($110K)
- [ ] **Pass Criteria**: All values show with correct formatting

### Test 4.2: Budget Category Breakdown ✓
**Expected**: Shows spending by category
- [ ] Verify category list appears
- [ ] Check categories:
  - [ ] Salaries (77%)
  - [ ] Tools (14%)
  - [ ] Training (6%)
  - [ ] Equipment (3%)
- [ ] Verify percentages add to 100%
- [ ] **Pass Criteria**: All categories displayed with correct percentages

### Test 4.3: Progress Visualization ✓
**Expected**: Visual progress bars for each category
- [ ] Verify progress bars show for each category
- [ ] Bars should be proportional to percentage
- [ ] Check color coding (red for high, green for normal)
- [ ] **Pass Criteria**: Bars render smoothly with correct lengths

### Test 4.4: Budget Animations ✓
**Expected**: Smooth entry animations
- [ ] Reload Budget tab
- [ ] Cards should slide in with fade animation
- [ ] Progress bars should animate from 0% to actual %
- [ ] **Pass Criteria**: Animations smooth and not janky

---

## Test Suite 5: Settings Tab

### Test 5.1: Form Load ✓
**Expected**: Edit form displays with current data
- [ ] Go to Settings tab
- [ ] Verify form loads with:
  - [ ] Department name input field
  - [ ] Department description textarea
  - [ ] Status dropdown (Active/Inactive)
- [ ] **Pass Criteria**: Form fields populated with current values

### Test 5.2: Edit Functionality ✓
**Expected**: Can edit department details
- [ ] Change department name
- [ ] Update description
- [ ] Change status
- [ ] Click Save button
- [ ] Should show success toast
- [ ] **Pass Criteria**: Changes save successfully

### Test 5.3: Validation ✓
**Expected**: Form validates input
- [ ] Try to submit empty name
- [ ] Should show validation message
- [ ] Cannot proceed with invalid data
- [ ] **Pass Criteria**: Validation works correctly

### Test 5.4: Danger Zone ✓
**Expected**: Delete option with warning
- [ ] Scroll to Danger Zone section
- [ ] Verify delete button appears
- [ ] Click delete
- [ ] Confirmation dialog should appear
- [ ] **Pass Criteria**: Destructive action requires confirmation

---

## Test Suite 6: Projects Tab

### Test 6.1: Project Grid Display ✓
**Expected**: Shows all projects in grid
- [ ] Go to Projects tab
- [ ] Wait for data to load
- [ ] Verify project cards display
- [ ] Check project count (should show 3 mock projects)
- [ ] **Pass Criteria**: All projects visible in grid layout

### Test 6.2: Project Information ✓
**Expected**: Complete project details visible
- [ ] Verify each project card shows:
  - [ ] Project name
  - [ ] Status badge (In Progress/Planning/Completed)
  - [ ] Progress bar (0-100%)
  - [ ] Team members count
  - [ ] Start and end dates
- [ ] **Pass Criteria**: All info displayed with correct formatting

### Test 6.3: Search Functionality ✓
**Expected**: Can filter projects by search term
- [ ] Use search box at top
- [ ] Type project name (e.g., "Mobile")
- [ ] Projects should filter in real-time
- [ ] Clear search should show all projects
- [ ] **Pass Criteria**: Search filters correctly

### Test 6.4: Status Badges ✓
**Expected**: Status badges color-coded
- [ ] Verify colors for different statuses:
  - [ ] In Progress - blue/cyan
  - [ ] Planning - yellow/amber
  - [ ] Completed - green
- [ ] **Pass Criteria**: Status badges styled correctly

### Test 6.5: New Project Button ✓
**Expected**: Button to create new project
- [ ] Locate "New Project" button
- [ ] Click button
- [ ] Should navigate to create form or show modal
- [ ] **Pass Criteria**: Button functional

---

## Test Suite 7: Tasks Tab

### Test 7.1: Task List Display ✓
**Expected**: Shows all tasks with details
- [ ] Go to Tasks tab
- [ ] Wait for data to load
- [ ] Verify task cards display (should show 4 mock tasks)
- [ ] Check task count
- [ ] **Pass Criteria**: All tasks visible in list

### Test 7.2: Task Information ✓
**Expected**: Complete task details visible
- [ ] Verify each task shows:
  - [ ] Task title
  - [ ] Status with icon (Pending/In Progress/Completed)
  - [ ] Priority (High/Medium/Low)
  - [ ] Assigned to
  - [ ] Due date
  - [ ] Associated project
- [ ] **Pass Criteria**: All task fields populated

### Test 7.3: Status Filters ✓
**Expected**: Can filter tasks by status
- [ ] Click "Pending" filter button
- [ ] Should show only pending tasks
- [ ] Click "In Progress" filter
- [ ] Should show only in-progress tasks
- [ ] Click "Completed" filter
- [ ] Should show only completed tasks
- [ ] Click "All Tasks" to reset
- [ ] **Pass Criteria**: Filters work correctly

### Test 7.4: Priority Indicator ✓
**Expected**: Priority shown with color coding
- [ ] Verify priority levels:
  - [ ] High - red color
  - [ ] Medium - yellow/orange color
  - [ ] Low - green color
- [ ] **Pass Criteria**: Priority colors consistent

### Test 7.5: New Task Button ✓
**Expected**: Can create new task
- [ ] Click "New Task" button
- [ ] Should navigate to create task form
- [ ] **Pass Criteria**: Button functional

---

## Test Suite 8: Meetings Tab

### Test 8.1: Meeting List Display ✓
**Expected**: Shows all meetings
- [ ] Go to Meetings tab
- [ ] Wait for data to load
- [ ] Verify meeting cards display (should show 3 mock meetings)
- [ ] **Pass Criteria**: All meetings visible

### Test 8.2: Meeting Information ✓
**Expected**: Complete meeting details
- [ ] Verify each meeting shows:
  - [ ] Meeting title
  - [ ] Date and time
  - [ ] Duration
  - [ ] Status badge
  - [ ] Attendee list
  - [ ] Meeting link
- [ ] **Pass Criteria**: All meeting info displayed

### Test 8.3: Attendee Display ✓
**Expected**: Shows attendees as badges
- [ ] Verify attendee badges appear
- [ ] Check attendee avatars with initials
- [ ] Verify attendee count accurate
- [ ] **Pass Criteria**: Attendees displayed correctly

### Test 8.4: Video Call Integration ✓
**Expected**: Meeting links functional
- [ ] Find "Join Meeting" button
- [ ] Click button (should open video call link)
- [ ] Link should be valid
- [ ] **Pass Criteria**: Meeting links work

### Test 8.5: Status Indicators ✓
**Expected**: Status shows meeting state
- [ ] Verify status badges:
  - [ ] Scheduled - yellow
  - [ ] Completed - gray
  - [ ] Cancelled - red
- [ ] **Pass Criteria**: Status styling correct

### Test 8.6: Schedule New Meeting ✓
**Expected**: Can schedule new meeting
- [ ] Click "Schedule Meeting" button
- [ ] Form should appear
- [ ] **Pass Criteria**: Navigation works

---

## Test Suite 9: Project Requests Tab

### Test 9.1: Request List Display ✓
**Expected**: Shows incoming project requests
- [ ] Go to Project Requests tab
- [ ] Wait for data to load
- [ ] Verify request cards display (should show 4 mock requests)
- [ ] **Pass Criteria**: All requests visible

### Test 9.2: Request Information ✓
**Expected**: Complete request details
- [ ] Verify each request shows:
  - [ ] From department name
  - [ ] Project name
  - [ ] Project description
  - [ ] Resources needed (number)
  - [ ] Project deadline
  - [ ] Request status
  - [ ] Request date
- [ ] **Pass Criteria**: All fields displayed correctly

### Test 9.3: Request Status ✓
**Expected**: Status clearly indicated
- [ ] Verify status badge for each request
- [ ] Colors should be:
  - [ ] Pending - amber/yellow
  - [ ] Approved - green
  - [ ] Rejected - red
- [ ] **Pass Criteria**: Status visible and styled

### Test 9.4: Approve Request ✓
**Expected**: Can approve pending requests
- [ ] Find a pending request
- [ ] Click "Approve" button
- [ ] Status should change to "Approved"
- [ ] Success toast should appear
- [ ] Action buttons should disappear
- [ ] **Pass Criteria**: Request approved successfully

### Test 9.5: Reject Request ✓
**Expected**: Can reject pending requests
- [ ] Find a pending request
- [ ] Click "Reject" button
- [ ] Status should change to "Rejected"
- [ ] Success toast should appear
- [ ] Action buttons should disappear
- [ ] **Pass Criteria**: Request rejected successfully

### Test 9.6: Send New Request ✓
**Expected**: Can send requests to other departments
- [ ] Click "Send Request" button
- [ ] Form should appear
- [ ] **Pass Criteria**: Navigation works

---

## Test Suite 10: Analytics Tab

### Test 10.1: Metrics Cards Display ✓
**Expected**: Key metrics appear at top
- [ ] Go to Analytics tab
- [ ] Verify 4 metric cards display:
  - [ ] Total Employees (24)
  - [ ] Avg Productivity (92%)
  - [ ] Completed Projects (12)
  - [ ] Avg Time to Hire (28 days)
- [ ] **Pass Criteria**: All metrics visible

### Test 10.2: Metrics Trends ✓
**Expected**: Shows positive/negative trends
- [ ] Verify trend indicators appear:
  - [ ] Up/down arrows (↑/↓)
  - [ ] Percentage/value change
  - [ ] Positive shown in green, negative in red
- [ ] **Pass Criteria**: Trends displayed correctly

### Test 10.3: Monthly Trends Chart ✓
**Expected**: Monthly data visualization
- [ ] Verify "Monthly Trends" section loads
- [ ] Check 4 months of data appear
- [ ] Verify progress bars show:
  - [ ] Blue for projects
  - [ ] Cyan for tasks
- [ ] **Pass Criteria**: Chart displays correctly

### Test 10.4: Department Comparison ✓
**Expected**: Productivity comparison chart
- [ ] Verify "Productivity Comparison" loads
- [ ] Check all 4 departments listed:
  - [ ] Engineering
  - [ ] Marketing
  - [ ] Sales
  - [ ] Operations
- [ ] Bars should be proportional to productivity
- [ ] **Pass Criteria**: Comparison chart displays

### Test 10.5: Department Details ✓
**Expected**: Key KPIs displayed
- [ ] Verify three info sections:
  - [ ] Total Headcount (24)
  - [ ] Budget Utilization (78%)
  - [ ] Project Success Rate (94%)
- [ ] Each should show current value + explanation
- [ ] **Pass Criteria**: All details visible

### Test 10.6: Alert System ✓
**Expected**: Important alerts displayed
- [ ] Verify alerts appear
- [ ] Should include:
  - [ ] Workload alert
  - [ ] Budget status alert
- [ ] Alerts should be color-coded
- [ ] **Pass Criteria**: Alerts visible and actionable

---

## Test Suite 11: Timeline Tab

### Test 11.1: Timeline Events Display ✓
**Expected**: Shows chronological event list
- [ ] Go to Timeline tab
- [ ] Wait for data to load
- [ ] Verify event cards display (should show 7 events)
- [ ] Events should be in reverse chronological order
- [ ] **Pass Criteria**: All events visible in correct order

### Test 11.2: Event Information ✓
**Expected**: Complete event details
- [ ] Verify each event shows:
  - [ ] Event title
  - [ ] Event description
  - [ ] Date/time
  - [ ] User who triggered event
  - [ ] Event icon with color
- [ ] **Pass Criteria**: All event info displayed

### Test 11.3: Timeline Filters ✓
**Expected**: Can filter by event type
- [ ] Click "Members Added" filter
- [ ] Should show only member addition events
- [ ] Click "Projects Started" filter
- [ ] Should show only project start events
- [ ] Click "All Events" to reset
- [ ] **Pass Criteria**: Filters work correctly

### Test 11.4: Event Color Coding ✓
**Expected**: Events color-coded by type
- [ ] Verify colors:
  - [ ] Member added - green
  - [ ] Member removed - red
  - [ ] Project started - blue
  - [ ] Project completed - purple
  - [ ] Budget updated - amber
  - [ ] Settings changed - cyan
  - [ ] Department created - indigo
- [ ] **Pass Criteria**: Colors consistent across events

### Test 11.5: Timeline Visual ✓
**Expected**: Beautiful timeline visualization
- [ ] Verify connecting line appears
- [ ] Dots should align vertically
- [ ] Cards should show to the right of timeline
- [ ] **Pass Criteria**: Timeline layout clean and readable

### Test 11.6: Summary Statistics ✓
**Expected**: Summary stats at bottom
- [ ] Verify 4 summary stats:
  - [ ] Total Events count
  - [ ] Members Added count
  - [ ] Projects count
  - [ ] Budget Updates count
- [ ] **Pass Criteria**: Summary stats calculated correctly

---

## Test Suite 12: Responsive Design

### Test 12.1: Mobile Viewport (375px) ✓
**Expected**: Works on mobile devices
- [ ] Resize to 375px width
- [ ] Sidebar should collapse
- [ ] Menu should be accessible
- [ ] Cards should stack vertically
- [ ] Text should be readable
- [ ] **Pass Criteria**: No horizontal scrolling, readable on small screens

### Test 12.2: Tablet Viewport (768px) ✓
**Expected**: Works on tablets
- [ ] Resize to 768px width
- [ ] Grid should show 2 columns where applicable
- [ ] All content should be visible
- [ ] **Pass Criteria**: Responsive grid layout

### Test 12.3: Desktop Viewport (1920px) ✓
**Expected**: Optimized for desktop
- [ ] Resize to 1920px width
- [ ] Should show full multi-column layout
- [ ] Proper spacing and alignment
- [ ] **Pass Criteria**: Uses full width appropriately

---

## Test Suite 13: Error Handling

### Test 13.1: Network Error Handling ✓
**Expected**: Shows error message on API failure
- [ ] Disconnect network
- [ ] Try to navigate to a tab
- [ ] Should show error message
- [ ] UI should not crash
- [ ] Can reconnect and retry
- [ ] **Pass Criteria**: Graceful error handling

### Test 13.2: Invalid Department ID ✓
**Expected**: Handles missing departments
- [ ] Navigate to invalid department ID
- [ ] Should show error message
- [ ] Can navigate back
- [ ] **Pass Criteria**: 404 handling works

### Test 13.3: Missing Data ✓
**Expected**: Shows empty states correctly
- [ ] If no employees, should show empty message
- [ ] If no projects, should show empty message
- [ ] **Pass Criteria**: Empty states render properly

---

## Test Suite 14: Authentication & Security

### Test 14.1: Token Authentication ✓
**Expected**: Uses bearer token for API calls
- [ ] Open DevTools - Network tab
- [ ] Navigate to any page
- [ ] Check API request headers
- [ ] Should include: `Authorization: Bearer [token]`
- [ ] **Pass Criteria**: Token properly sent

### Test 14.2: Session Timeout ✓
**Expected**: Handles expired sessions
- [ ] Clear localStorage auth token
- [ ] Try to navigate to protected page
- [ ] Should redirect to login
- [ ] **Pass Criteria**: Session timeout handled

### Test 14.3: Permission Check ✓
**Expected**: Only show permitted menus
- [ ] As non-admin user, workspace should not show
- [ ] As admin/hr-manager, workspace should show
- [ ] Permission guards should work
- [ ] **Pass Criteria**: Permission-based visibility works

---

## Test Suite 15: Performance

### Test 15.1: Page Load Time ✓
**Expected**: Pages load within acceptable time
- [ ] Open DevTools - Performance tab
- [ ] Navigate to each tab
- [ ] Should load within 2-3 seconds
- [ ] No console errors
- [ ] **Pass Criteria**: Load time < 3 seconds, no errors

### Test 15.2: Animation Performance ✓
**Expected**: Smooth animations
- [ ] Watch all animations (fade, slide, expand)
- [ ] Should be smooth at 60fps
- [ ] No jank or stuttering
- [ ] **Pass Criteria**: Smooth 60fps animations

### Test 15.3: Scroll Performance ✓
**Expected**: Smooth scrolling
- [ ] Scroll through long lists
- [ ] Should be butter smooth
- [ ] No lag or jank
- [ ] **Pass Criteria**: 60fps scrolling

---

## Regression Testing Checklist

After any code changes, verify:

- [ ] All 7 tabs still load
- [ ] Navigation between tabs works
- [ ] Back button works
- [ ] Data displays correctly
- [ ] Forms submit successfully
- [ ] Delete operations work
- [ ] Filters and searches work
- [ ] Animations play smoothly
- [ ] No console errors
- [ ] No broken images/icons
- [ ] Responsive design intact
- [ ] Authentication still works

---

## Recording Test Results

### Template
```
Test Suite: [Number & Name]
Date: [YYYY-MM-DD]
Browser: [Chrome/Firefox/Edge]
Version: [Version Number]
Tester: [Name]

Results:
- Test [Number]: [PASS/FAIL] - [Notes]
- Test [Number]: [PASS/FAIL] - [Notes]

Issues Found:
1. [Issue Description] - Severity: [Critical/High/Medium/Low]

Recommendations:
- [Any recommendations]
```

---

## Test Summary

**Total Tests**: 85+
**Categories**: 15
**Estimated Time**: 4-6 hours for full QA cycle

### Priority Order for Testing:
1. Navigation & Menu (Critical)
2. Overview Tab (Critical)
3. Members Tab (High)
4. Error Handling (High)
5. Responsive Design (High)
6. All Other Features (Medium)

---

**Status**: Ready for QA Testing
**Last Updated**: [Current Date]

#!/bin/bash

# TradeSphere - Interactive Supabase Database Setup
# This script helps you set up the database with your Supabase project

echo "🚀 TradeSphere - Supabase Database Setup"
echo "========================================="
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "📄 Found .env.local file"
    source .env.local 2>/dev/null
fi

# Get Supabase URL
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "📍 Please enter your Supabase project URL:"
    echo "   (Find it at: https://supabase.com/dashboard)"
    echo "   Format: https://xxxxx.supabase.co"
    echo ""
    read -p "Supabase URL: " SUPABASE_URL
    
    if [ -z "$SUPABASE_URL" ]; then
        echo "❌ Error: Supabase URL is required"
        exit 1
    fi
    
    # Save to .env.local
    if [ ! -f .env.local ]; then
        cp .env.local .env.local.bak 2>/dev/null
    fi
    
    echo "" >> .env.local
    echo "NEXT_PUBLIC_SUPABASE_URL=\"$SUPABASE_URL\"" >> .env.local
    echo "✅ Saved to .env.local"
else
    SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
    echo "✅ Using URL from .env.local: $SUPABASE_URL"
fi

# Extract project reference
PROJECT_REF=$(echo $SUPABASE_URL | sed 's/https:\/\///' | sed 's/.supabase.co//')

echo ""
echo "📍 Project Reference: $PROJECT_REF"
echo "🔑 Service Key: (from .env.local)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Choose your setup method:"
echo ""
echo "1. Supabase SQL Editor (Recommended - Easiest)"
echo "2. Get connection string for Prisma"
echo "3. View SQL file"
echo "4. Open Supabase Dashboard"
echo ""
read -p "Enter choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "✨ Opening Supabase SQL Editor..."
        echo ""
        echo "📝 Steps:"
        echo "   1. Click 'New Query' in the SQL Editor"
        echo "   2. Copy SQL from: scripts/schema.sql"
        echo "   3. Paste into editor"
        echo "   4. Click 'Run' button"
        echo ""
        
        # Open SQL file and browser
        if command -v code &> /dev/null; then
            code scripts/schema.sql
        fi
        
        sleep 2
        
        if command -v open &> /dev/null; then
            open "https://supabase.com/dashboard/project/$PROJECT_REF/editor"
        elif command -v xdg-open &> /dev/null; then
            xdg-open "https://supabase.com/dashboard/project/$PROJECT_REF/editor"
        else
            echo "🌐 Open: https://supabase.com/dashboard/project/$PROJECT_REF/editor"
        fi
        ;;
        
    2)
        echo ""
        echo "📝 Get your connection string:"
        echo ""
        echo "1. Go to: https://supabase.com/dashboard/project/$PROJECT_REF/settings/database"
        echo "2. Scroll to 'Connection string'"
        echo "3. Click 'Connection pooling' tab"
        echo "4. Copy the URI"
        echo ""
        echo "Then update .env.local with:"
        echo "DATABASE_URL=\"your_connection_string?pgbouncer=true\""
        echo ""
        echo "And run:"
        echo "  npx prisma db push"
        echo ""
        
        if command -v open &> /dev/null; then
            open "https://supabase.com/dashboard/project/$PROJECT_REF/settings/database"
        elif command -v xdg-open &> /dev/null; then
            xdg-open "https://supabase.com/dashboard/project/$PROJECT_REF/settings/database"
        fi
        ;;
        
    3)
        echo ""
        echo "📄 Viewing SQL schema..."
        echo ""
        cat scripts/schema.sql
        echo ""
        echo "💾 File location: scripts/schema.sql"
        ;;
        
    4)
        echo ""
        echo "🌐 Opening Supabase Dashboard..."
        
        if command -v open &> /dev/null; then
            open "https://supabase.com/dashboard/project/$PROJECT_REF"
        elif command -v xdg-open &> /dev/null; then
            xdg-open "https://supabase.com/dashboard/project/$PROJECT_REF"
        else
            echo "Open: https://supabase.com/dashboard/project/$PROJECT_REF"
        fi
        ;;
        
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 Documentation:"
echo "   - Quick Start: SUPABASE_QUICK_START.md"
echo "   - Detailed Guide: SUPABASE_SETUP.md"
echo ""
echo "🆘 Need help? Check the documentation files above!"
echo ""
